(() => {
  const root = document.documentElement;
  const body = document.body;
  const themeToggle = document.querySelector('#theme-toggle');
  const menuToggle = document.querySelector('#menu-toggle');
  const sidebar = document.querySelector('#sidebar');
  const backdrop = document.querySelector('#sidebar-backdrop');
  const toast = document.querySelector('#toast');
  const search = document.querySelector('#doc-search');
  const navLinks = [...document.querySelectorAll('.side-nav a')];

  const preferredTheme = () => {
    try {
      return localStorage.getItem('aether-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    } catch {
      return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
  };

  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Activer le thème clair' : 'Activer le thème sombre');
    try { localStorage.setItem('aether-theme', theme); } catch { /* Storage may be disabled. */ }
  };

  applyTheme(preferredTheme());
  themeToggle.addEventListener('click', () => applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

  const closeNavigation = () => {
    body.classList.remove('nav-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  };
  menuToggle.addEventListener('click', () => {
    const isOpen = body.classList.toggle('nav-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
  backdrop.addEventListener('click', closeNavigation);
  navLinks.forEach((link) => link.addEventListener('click', closeNavigation));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeNavigation();
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      search.focus();
    }
  });

  search.addEventListener('input', () => {
    const query = search.value.trim().toLocaleLowerCase('fr');
    document.querySelectorAll('[data-search-group]').forEach((group) => {
      let matches = 0;
      group.querySelectorAll('a').forEach((link) => {
        const match = !query || link.textContent.toLocaleLowerCase('fr').includes(query);
        link.hidden = !match;
        if (match) matches += 1;
      });
      group.hidden = matches === 0;
    });
  });

  let toastTimer;
  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
  };
  document.querySelectorAll('[data-copy]').forEach((button) => {
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.copy);
        showToast('Copié dans le presse-papiers');
      } catch {
        showToast('Copie indisponible dans ce navigateur');
      }
    });
  });

  const tabList = document.querySelector('[role="tablist"]');
  if (tabList) {
    const tabs = [...tabList.querySelectorAll('[role="tab"]')];
    const selectTab = (tab) => {
      tabs.forEach((item) => {
        const selected = item === tab;
        item.setAttribute('aria-selected', String(selected));
        item.tabIndex = selected ? 0 : -1;
        document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
      });
      tab.focus();
    };
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => selectTab(tab));
      tab.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        let nextIndex = index;
        if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = tabs.length - 1;
        selectTab(tabs[nextIndex]);
      });
    });
  }

  const customSelects = [...document.querySelectorAll('[data-select]')];
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
      updateSelectValue();
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

  document.querySelectorAll('[data-toggle]').forEach((toggle) => {
    toggle.addEventListener('click', () => {
      toggle.setAttribute('aria-checked', String(toggle.getAttribute('aria-checked') !== 'true'));
    });
  });

  const indeterminate = document.querySelector('#indeterminate-check');
  if (indeterminate) indeterminate.indeterminate = true;

  const dialog = document.querySelector('#demo-dialog');
  const openDialog = document.querySelector('#open-dialog');
  openDialog.addEventListener('click', () => dialog.showModal());
  dialog.addEventListener('click', (event) => {
    const bounds = dialog.getBoundingClientRect();
    const outside = event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
    if (outside) dialog.close('cancel');
  });

  if ('IntersectionObserver' in window) {
    const sections = [...document.querySelectorAll('.doc-section[id]')];
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((link) => link.classList.toggle('active', link.hash === `#${visible.target.id}`));
    }, { rootMargin: '-18% 0px -66% 0px', threshold: [0, .15, .4] });
    sections.forEach((section) => observer.observe(section));
  }
})();
