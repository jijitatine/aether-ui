export function setupSelects(root = document) {
  const customSelects = [...root.querySelectorAll('[data-select]')];
  const closeSelect = (select, restoreFocus = false) => {
    const trigger = select.querySelector('.select-trigger');
    const popover = select.querySelector('.select-popover');
    if (!trigger || !popover || popover.hidden) return;
    popover.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    if (restoreFocus) trigger.focus();
  };
  const closeOtherSelects = (current) => {
    customSelects.forEach((select) => {
      if (select !== current) closeSelect(select);
    });
  };
  customSelects.forEach((select) => {
    const trigger = select.querySelector('.select-trigger');
    const popover = select.querySelector('.select-popover');
    if (!trigger || !popover) return;
    const options = [...popover.querySelectorAll('[role="option"]')];
    const multiple = select.hasAttribute('data-multiple');
    const searchInput = popover.querySelector('[data-select-search]');
    const emptyState = popover.querySelector('[data-select-empty]');
    const enabledOptions = () => options.filter((option) => !option.disabled && !option.hidden);
    const selectedOptions = () => options.filter((option) => option.getAttribute('aria-selected') === 'true');
    const optionLabel = (option) => option.dataset.label || option.textContent.trim();
    const updateSelectValue = () => {
      const selected = selectedOptions();
      const valueNode = select.querySelector('[data-select-value]');
      const input = select.querySelector('input[type="hidden"]');
      const summary = select.querySelector('[data-select-summary]');
      const label = select.querySelector('label')?.textContent.trim() || 'Sélecteur';
      const labels = selected.map(optionLabel);
      if (valueNode) {
        valueNode.replaceChildren();
        if (!selected.length) {
          valueNode.textContent = valueNode.dataset.placeholderText || 'Sélectionner';
        } else if (selected.some((option) => option.dataset.icon)) {
          const limit = multiple ? 2 : 1;
          selected.slice(0, limit).forEach((option) => {
            const chip = document.createElement('span');
            chip.className = 'select-selection-chip';
            if (option.dataset.icon) {
              const icon = document.createElement('span');
              icon.className = 'select-selection-chip-visual';
              icon.setAttribute('aria-hidden', 'true');
              icon.textContent = option.dataset.icon;
              chip.append(icon);
            }
            const name = document.createElement('span');
            name.textContent = optionLabel(option);
            chip.append(name);
            valueNode.append(chip);
          });
          if (selected.length > limit) {
            const more = document.createElement('span');
            more.className = 'select-selection-chip-more';
            more.textContent = `+${selected.length - limit}`;
            valueNode.append(more);
          }
        } else {
          valueNode.textContent = labels.join(' · ');
        }
        valueNode.toggleAttribute('data-placeholder', !selected.length);
      }
      trigger.setAttribute('aria-label', selected.length ? `${label} : ${labels.join(', ')}` : `${label} : ${valueNode?.dataset.placeholderText || 'aucune sélection'}`);
      if (input) input.value = selected.map((option) => option.dataset.value || '').filter(Boolean).join(',');
      if (summary) summary.textContent = selected.length ? `${selected.length} pays sélectionné${selected.length > 1 ? 's' : ''}.` : 'Aucun pays sélectionné.';
    };
    const applyFilter = () => {
      const query = searchInput?.value.trim().toLocaleLowerCase('fr') || '';
      let visible = 0;
      options.forEach((option) => {
        const matches = !query || optionLabel(option).toLocaleLowerCase('fr').includes(query);
        option.hidden = !matches;
        if (matches) visible += 1;
      });
      if (emptyState) emptyState.hidden = visible !== 0;
    };
    const resetFilter = () => {
      if (!searchInput) return;
      searchInput.value = '';
      applyFilter();
    };
    const openSelect = (edge = 'selected') => {
      closeOtherSelects(select);
      popover.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
      resetFilter();
      if (searchInput) {
        searchInput.focus();
        return;
      }
      const available = enabledOptions();
      const selected = available.find((option) => option.getAttribute('aria-selected') === 'true');
      const target = edge === 'last' ? available.at(-1) : edge === 'first' ? available[0] : selected || available[0];
      target?.focus();
    };
    const chooseOption = (option) => {
      if (multiple) option.setAttribute('aria-selected', String(option.getAttribute('aria-selected') !== 'true'));
      else options.forEach((item) => item.setAttribute('aria-selected', String(item === option)));
      const input = select.querySelector('input[type="hidden"]');
      const previousValue = input?.value;
      updateSelectValue();
      if (input && input.value !== previousValue) input.dispatchEvent(new Event('change', { bubbles: true }));
      if (select.classList.contains('error')) {
        select.classList.remove('error');
        trigger.removeAttribute('aria-invalid');
        trigger.removeAttribute('aria-describedby');
        const errorMessage = select.querySelector('small[id]');
        if (errorMessage) errorMessage.hidden = true;
      }
      if (!multiple) closeSelect(select, true);
    };
    trigger.addEventListener('click', () => {
      if (trigger.getAttribute('aria-expanded') === 'true') closeSelect(select);
      else openSelect();
    });
    trigger.addEventListener('keydown', (event) => {
      if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      openSelect(event.key === 'ArrowUp' || event.key === 'End' ? 'last' : 'first');
    });
    options.forEach((option) => {
      option.addEventListener('click', () => chooseOption(option));
      option.addEventListener('keydown', (event) => {
        const available = enabledOptions();
        const index = available.indexOf(option);
        if (event.key === 'Escape') {
          event.preventDefault();
          closeSelect(select, true);
          return;
        }
        if (event.key === 'Tab') {
          closeSelect(select);
          return;
        }
        if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        let nextIndex = index;
        if (event.key === 'ArrowDown') nextIndex = (index + 1) % available.length;
        if (event.key === 'ArrowUp') nextIndex = (index - 1 + available.length) % available.length;
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = available.length - 1;
        available[nextIndex]?.focus();
      });
    });
    if (searchInput) {
      searchInput.addEventListener('input', applyFilter);
      searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          closeSelect(select, true);
          return;
        }
        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
        event.preventDefault();
        const available = enabledOptions();
        const target = event.key === 'ArrowDown' ? available[0] : available.at(-1);
        target?.focus();
      });
    }
    updateSelectValue();
  });
  document.addEventListener('pointerdown', (event) => {
    customSelects.forEach((select) => {
      if (!select.contains(event.target)) closeSelect(select);
    });
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    customSelects.forEach((select) => closeSelect(select, select.querySelector('.select-trigger')?.getAttribute('aria-expanded') === 'true'));
  });
}
