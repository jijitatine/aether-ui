import { setupSelects } from './select.js';
import { setupPagination } from './pagination.js';
import { setupBulkActions } from './bulk-actions.js';
import { setupStepper, updateStepperSummary } from './stepper.js';
import { setupCombobox } from './combobox.js';
import { createToast } from './toast.js';

const byId = (id) => document.getElementById(id);
const filters = byId('filters');
const search = byId('product-search');
const start = byId('date-from');
const end = byId('date-to');
const dateError = byId('date-error');
const rows = byId('product-rows');
const table = byId('catalog-table');
const count = byId('catalog-count');
const add = byId('add-product');
const editor = byId('product-editor');
const form = byId('product-form');
const remove = byId('delete-product');
const confirmation = byId('delete-confirm');
const showToast = createToast();
const theme = byId('catalog-theme');

const statuses = {
  active: { label: 'Actif', tone: 'success' },
  draft: { label: 'Brouillon', tone: 'warning' },
  archived: { label: 'Archivé', tone: 'neutral' },
};
let products = [
  { id: 101, name: 'Lampe Halo', category: 'Éclairage', status: 'active', price: 89, date: '2026-11-10' },
  { id: 102, name: 'Fauteuil Rivage', category: 'Mobilier', status: 'active', price: 289, date: '2026-11-07' },
  { id: 103, name: 'Vase Dune', category: 'Décoration', status: 'draft', price: 32, date: '2026-11-04' },
  { id: 104, name: 'Plaid Brume', category: 'Textile', status: 'active', price: 59, date: '2026-11-01' },
  { id: 105, name: 'Miroir Horizon', category: 'Décoration', status: 'archived', price: 125, date: '2026-10-26' },
  { id: 106, name: 'Applique Écume', category: 'Éclairage', status: 'draft', price: 74.9, date: '2026-10-22' },
];
const collections = [
  ['Éclairage', ['Lampe', 'Applique', 'Suspension', 'Lampadaire']],
  ['Mobilier', ['Fauteuil', 'Console', 'Tabouret', 'Étagère']],
  ['Décoration', ['Vase', 'Miroir', 'Cadre', 'Bougeoir']]
];
const finishes = ['Sable', 'Lin', 'Ardoise'];
for (const [category, names] of collections) {
  for (const name of names) {
    for (const finish of finishes) {
      const id = 101 + products.length;
      const date = new Date(Date.UTC(2026, 9, 20 - (id - 107))).toISOString().slice(0, 10);
      products.push({ id, name: name + ' ' + finish, category,
        status: id % 4 === 0 ? 'draft' : 'active', price: 19 + (id % 23) * 6, date });
    }
  }
}
let nextId = 101 + products.length;
let state = 'ready';
let sort = { key: 'date', direction: 'descending' };
let editedId = null;
let editorTrigger = add;
let previewTimer;

const currency = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });
const calendar = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const collator = new Intl.Collator('fr', { sensitivity: 'base' });
const normalize = (text) => text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase('fr');
const reference = (id) => 'PRD-' + id;

function element(tag, text, className) {
  const node = document.createElement(tag);
  node.textContent = text;
  if (className) node.className = className;
  return node;
}

function setTheme(value) {
  document.documentElement.dataset.theme = value;
  theme.textContent = value === 'dark' ? 'Thème clair' : 'Thème sombre';
  try { localStorage.setItem('aether-theme', value); } catch { /* Storage may be unavailable. */ }
}

let preferred = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
try { preferred = localStorage.getItem('aether-theme') || preferred; } catch { /* Use system preference. */ }
setTheme(preferred);
theme.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));

function validatePeriod() {
  end.min = start.value;
  let message = '';
  let invalid;
  if (Boolean(start.value) !== Boolean(end.value)) {
    message = 'Renseignez les deux dates pour filtrer la période.';
    invalid = start.value ? end : start;
  } else if (end.value && end.value < start.value) {
    message = 'La date de fin doit être égale ou postérieure à la date de début.';
    invalid = end;
  }
  for (const input of [start, end]) input.setAttribute('aria-invalid', String(input === invalid));
  dateError.hidden = !message;
  dateError.textContent = message;
  return !message;
}

function visibleProducts() {
  const query = normalize(search.value.trim());
  const usePeriod = dateError.hidden && start.value;
  const result = products.filter((product) => {
    const text = normalize([product.name, reference(product.id), product.category].join(' '));
    return text.includes(query) && (!usePeriod || (start.value <= product.date && product.date <= end.value));
  });
  return result.sort((a, b) => {
    const left = a[sort.key];
    const right = b[sort.key];
    const difference = typeof left === 'number' ? left - right : collator.compare(left, right);
    return sort.direction === 'ascending' ? difference : -difference;
  });
}

function showTableState(message, action, onAction) {
  const cell = element('td', '', 'catalog-state');
  cell.colSpan = 6;
  cell.append(element('p', message));
  if (action) {
    const button = element('button', action, 'button secondary');
    button.type = 'button';
    button.addEventListener('click', onAction);
    cell.append(button);
  }
  rows.insertRow().append(cell);
}

function renderProduct(product) {
  const row = rows.insertRow();
  const checkbox = element('input', '', 'bulk-checkbox');
  checkbox.type = 'checkbox';
  checkbox.dataset.bulkRow = '';
  checkbox.value = String(product.id);
  checkbox.disabled = product.status === 'archived';
  checkbox.setAttribute('aria-label', 'Sélectionner ' + product.name);
  row.insertCell().append(checkbox);
  const heading = element('th', '');
  heading.scope = 'row';
  const button = element('button', product.name, 'button ghost product-link');
  button.type = 'button';
  button.dataset.product = String(product.id);
  button.addEventListener('click', () => openEditor(product, button));
  heading.append(button, element('small', reference(product.id)));
  row.append(heading, element('td', product.category));
  const status = statuses[product.status];
  row.insertCell().append(element('span', status.label, 'badge ' + status.tone));
  row.append(element('td', currency.format(product.price), 'table-number'));
  const date = element('time', calendar.format(new Date(product.date)));
  date.dateTime = product.date;
  row.insertCell().append(date);
}

function render() {
  const result = state === 'ready' ? visibleProducts() : [];
  const pageRows = pagination.slice(result);
  rows.replaceChildren();
  table.setAttribute('aria-busy', String(state === 'loading'));
  add.disabled = state !== 'ready';
  for (const button of table.querySelectorAll('[data-sort]')) {
    const header = button.closest('th');
    const active = button.dataset.sort === sort.key && result.length > 0;
    button.disabled = result.length === 0;
    if (active) header.setAttribute('aria-sort', sort.direction);
    else header.removeAttribute('aria-sort');
  }
  if (state === 'loading') {
    count.textContent = 'Chargement des produits…';
    for (let index = 0; index < 3; index += 1) {
      const row = rows.insertRow();
      row.setAttribute('aria-hidden', 'true');
      for (let column = 0; column < 6; column += 1) row.insertCell().append(element('span', '', 'catalog-skeleton'));
    }
  } else if (state === 'error') {
    count.textContent = 'Erreur de chargement';
    showTableState('Impossible de charger le catalogue.', 'Réessayer', () => preview('loading', add));
  } else {
    count.textContent = result.length + (result.length > 1 ? ' produits' : ' produit');
    if (pageRows.length) pageRows.forEach(renderProduct);
    else if (state === 'empty' || !products.length) {
      showTableState('Le catalogue est vide.', state === 'empty' ? 'Revenir au catalogue' : 'Ajouter un produit',
        () => state === 'empty' ? preview('ready', add) : openEditor(null, add));
    } else {
      showTableState('Aucun produit ne correspond aux filtres.', 'Réinitialiser les filtres', () => {
        filters.reset();
        search.focus();
      });
    }
  }
  bulkActions.sync();
}

function preview(value, focusTarget) {
  clearTimeout(previewTimer);
  state = value;
  render();
  if (value === 'loading') {
    if (focusTarget) table.parentElement.focus();
    previewTimer = setTimeout(() => {
      const target = document.activeElement === table.parentElement ? focusTarget : undefined;
      preview('ready', target);
    }, 1400);
  } else {
    focusTarget?.focus();
  }
}

filters.addEventListener('input', () => { validatePeriod(); pagination.reset(); render(); });
filters.addEventListener('submit', (event) => event.preventDefault());
filters.addEventListener('reset', () => queueMicrotask(() => { validatePeriod(); pagination.reset(); render(); }));
for (const button of table.querySelectorAll('[data-sort]')) {
  button.addEventListener('click', () => {
    const key = button.dataset.sort;
    sort = { key, direction: sort.key === key && sort.direction === 'ascending' ? 'descending' : 'ascending' };
    render();
  });
}
for (const button of document.querySelectorAll('[data-preview]')) {
  button.addEventListener('click', () => preview(button.dataset.preview));
}

function fieldError(input, message) {
  const hint = byId(input.id + '-error');
  hint.textContent = message;
  hint.hidden = !message;
  input.setAttribute('aria-invalid', String(Boolean(message)));
}

function openEditor(product, trigger) {
  editedId = product?.id ?? null;
  editorTrigger = trigger;
  form.reset();
  const fields = form.elements;
  fields.name.value = product?.name ?? '';
  fields.category.value = product?.category ?? '';
  fields.price.value = product?.price ?? '';
  fields.status.value = product?.status ?? 'draft';
  for (const field of [fields.name, fields.category, fields.price]) fieldError(field, '');
  byId('editor-title').textContent = product ? 'Modifier le produit' : 'Ajouter un produit';
  byId('editor-reference').textContent = product ? reference(product.id) : '';
  remove.hidden = !product;
  stepper.reset(!product);
  editor.showModal();
}

function closeEditorAndRefresh(message) {
  const triggerId = editorTrigger.dataset.product;
  editor.close();
  render();
  const replacement = triggerId ? rows.querySelector('[data-product="' + triggerId + '"]') : add;
  const focusTarget = replacement || (editorTrigger.isConnected ? editorTrigger : add);
  focusTarget.focus();
  showToast(focusTarget, 'success', message);
}

add.addEventListener('click', () => openEditor(null, add));
byId('close-editor').addEventListener('click', () => editor.close());
byId('cancel-editor').addEventListener('click', () => editor.close());

const fieldMessages = {
  name: 'Saisissez le nom du produit.',
  category: 'Saisissez la catégorie.',
  price: 'Saisissez un prix entre 0 et 999 999,99 €, avec deux décimales au maximum.',
};
const stepper = setupStepper(form, {
  validate(panel) {
    for (const input of panel.querySelectorAll('input')) {
      if (!input.reportValidity()) return false;
      if (['name', 'category'].includes(input.name) && !input.value.trim()) {
        fieldError(input, fieldMessages[input.name]);
        input.focus();
        return false;
      }
    }
    return true;
  },
  review() {
    const { name, category, price, status } = form.elements;
    updateStepperSummary(form, {
      name: name.value.trim(), category: category.value.trim(),
      price: currency.format(price.valueAsNumber), status: statuses[status.value].label
    });
  }
});
form.addEventListener('invalid', (event) => {
  const input = event.target;
  if (fieldMessages[input.name]) fieldError(input, fieldMessages[input.name]);
}, true);
form.addEventListener('input', (event) => {
  if (fieldMessages[event.target.name]) fieldError(event.target, '');
});
form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!stepper.readyToSubmit() || (editedId !== null && !form.reportValidity())) return;
  const fields = form.elements;
  const missing = [fields.name, fields.category].filter((input) => !input.value.trim());
  if (missing.length) {
    missing.forEach((input) => fieldError(input, fieldMessages[input.name]));
    missing[0].focus();
    return;
  }
  const product = {
    name: fields.name.value.trim(), category: fields.category.value.trim(),
    price: fields.price.valueAsNumber, status: fields.status.value,
  };
  if (editedId === null) {
    const today = new Date();
    const date = [today.getFullYear(), today.getMonth() + 1, today.getDate()]
      .map((value) => String(value).padStart(2, '0')).join('-');
    products.push({ ...product, id: nextId++, date });
    pagination.reset();
    closeEditorAndRefresh('Produit créé.');
  } else {
    products = products.map((item) => item.id === editedId ? { ...item, ...product } : item);
    closeEditorAndRefresh('Produit modifié.');
  }
});

remove.addEventListener('click', () => {
  const product = products.find((item) => item.id === editedId);
  byId('delete-description').textContent = '« ' + product.name + ' » sera retiré du catalogue de démonstration.';
  confirmation.returnValue = '';
  confirmation.showModal();
});
confirmation.addEventListener('close', () => {
  if (confirmation.returnValue !== 'confirm') {
    remove.focus();
    return;
  }
  products = products.filter((item) => item.id !== editedId);
  closeEditorAndRefresh('Produit supprimé.');
});

setupCombobox(byId('product-lookup'), {
  getOptions: (query) => {
    const term = normalize(query);
    return products
      .filter(({ name, id }) => normalize(name + ' ' + reference(id)).includes(term))
      .map((product) => ({
        product,
        label: product.name,
        detail: reference(product.id) + ' · ' + statuses[product.status].label
      }));
  },
  onSelect: ({ product }, input) => {
    input.value = '';
    openEditor(product, input);
  }
});

setupSelects();
const pagination = setupPagination(byId('product-pagination'), { onChange: render, unit: 'produits' });

const bulkActions = setupBulkActions(table.closest('.catalog-panel'), {
  archive(ids) {
    const selected = new Set(ids);
    products = products.map(product => selected.has(String(product.id))
      ? { ...product, status: 'archived' } : product);
    render();
  },
  showToast,
  fallbackFocus: search
});

render();
