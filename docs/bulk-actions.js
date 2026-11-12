export function setupBulkActions(root, { archive, showToast, fallbackFocus }) {
  const all = root.querySelector('[data-bulk-all]');
  const bar = root.querySelector('[data-bulk-bar]');
  const count = root.querySelector('[data-bulk-count]');
  const status = root.querySelector('[data-bulk-status]');
  const action = root.querySelector('[data-bulk-action]');
  const clear = root.querySelector('[data-bulk-clear]');
  const dialog = root.querySelector('[data-bulk-dialog]');
  const selected = new Set();
  let pending = [];
  const eligible = () => [...root.querySelectorAll('[data-bulk-row]:enabled')];
  const quantity = (size, singular, plural) => size + ' produit' + (size === 1 ? ' ' + singular : 's ' + plural);

  function sync() {
    const boxes = eligible();
    const visible = new Set(boxes.map(box => box.value));
    for (const value of selected) {
      if (!visible.has(value)) selected.delete(value);
    }
    for (const box of boxes) box.checked = selected.has(box.value);
    const size = selected.size;
    all.disabled = !boxes.length;
    all.checked = size > 0 && size === boxes.length;
    all.indeterminate = size > 0 && size < boxes.length;
    bar.hidden = size === 0;
    const message = quantity(size, 'sélectionné', 'sélectionnés');
    count.textContent = message;
    if (status.textContent !== message) status.textContent = message;
  }

  function restoreFocus() {
    (all.disabled ? fallbackFocus : all).focus();
  }

  root.addEventListener('change', ({ target }) => {
    if (target === all) {
      selected.clear();
      if (all.checked) eligible().forEach(box => selected.add(box.value));
    } else if (target.matches('[data-bulk-row]:enabled')) {
      if (target.checked) selected.add(target.value);
      else selected.delete(target.value);
    } else {
      return;
    }
    sync();
  });

  clear.addEventListener('click', () => {
    selected.clear();
    sync();
    restoreFocus();
  });

  action.addEventListener('click', () => {
    pending = [...selected];
    dialog.querySelector('[data-bulk-description]').textContent =
      'Archiver ' + quantity(pending.length, 'sélectionné', 'sélectionnés') + ' ?';
    dialog.returnValue = '';
    dialog.showModal();
  });

  dialog.addEventListener('close', () => {
    if (dialog.returnValue !== 'archive') return;
    const ids = pending.filter(id => selected.has(id));
    selected.clear();
    if (ids.length) archive(ids);
    sync();
    restoreFocus();
    if (ids.length) showToast(document.activeElement, 'success', quantity(ids.length, 'archivé', 'archivés') + '.');
  });

  return { sync };
}
