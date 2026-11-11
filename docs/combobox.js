export function setupCombobox(input, { getOptions, onSelect }) {
  const container = input.closest('.combobox');
  const popup = container.querySelector('.combobox-popup');
  const list = popup.querySelector('ul');
  const empty = popup.querySelector('p');
  const status = container.querySelector('[role="status"]');
  let options = [];
  let active = -1;

  function close() {
    popup.hidden = true;
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
    status.textContent = '';
    active = -1;
  }

  function select(option) {
    input.value = option.label;
    close();
    onSelect(option, input);
  }

  function open() {
    options = getOptions(input.value.trim()).slice(0, 8);
    active = -1;
    input.removeAttribute('aria-activedescendant');
    const nodes = options.map((option, index) => {
      const node = document.createElement('li');
      node.id = list.id + '-' + index;
      node.setAttribute('role', 'option');
      node.setAttribute('aria-selected', 'false');
      const title = document.createElement('strong');
      title.textContent = option.label;
      const detail = document.createElement('small');
      detail.textContent = option.detail ?? '';
      node.append(title, detail);
      node.addEventListener('click', () => select(option));
      return node;
    });
    list.replaceChildren(...nodes);
    empty.hidden = options.length > 0;
    popup.hidden = false;
    input.setAttribute('aria-expanded', 'true');
    status.textContent = options.length
      ? options.length + (options.length === 1 ? ' suggestion disponible.' : ' suggestions disponibles.')
      : empty.textContent;
  }

  function move(direction) {
    if (popup.hidden) open();
    if (!options.length) return;
    if (active >= 0) list.children[active].setAttribute('aria-selected', 'false');
    active = active < 0 && direction < 0
      ? options.length - 1
      : Math.max(0, Math.min(options.length - 1, active + direction));
    const node = list.children[active];
    node.setAttribute('aria-selected', 'true');
    input.setAttribute('aria-activedescendant', node.id);
    node.scrollIntoView({ block: 'nearest' });
  }

  input.addEventListener('input', (event) => {
    if (!event.isComposing) open();
  });
  input.addEventListener('compositionend', open);
  input.addEventListener('click', () => { if (popup.hidden) open(); });
  input.addEventListener('blur', close);
  popup.addEventListener('mousedown', (event) => event.preventDefault());
  input.addEventListener('keydown', (event) => {
    if (event.isComposing) return;
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        event.preventDefault();
        move(event.key === 'ArrowDown' ? 1 : -1);
        break;
      case 'Enter':
        if (popup.hidden || active < 0) break;
        event.preventDefault();
        select(options[active]);
        break;
      case 'Escape':
        if (popup.hidden) break;
        event.preventDefault();
        event.stopPropagation();
        close();
        break;
    }
  });
}
