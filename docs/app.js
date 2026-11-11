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

  document.querySelectorAll('[data-table-demo]').forEach((demo) => {
    const table = demo.querySelector('table');
    const body = demo.querySelector('[data-table-rows]');
    const status = demo.querySelector('[data-table-status]');
    const sortButtons = [...demo.querySelectorAll('[data-table-sort]')];
    const stateButtons = [...demo.querySelectorAll('[data-table-state]')];
    const collator = new Intl.Collator(document.documentElement.lang, { numeric: true });
    const messages = {
      ready: '',
      loading: 'Chargement des projets…',
      empty: 'Aucun projet à afficher.',
      error: 'Impossible de charger les projets.',
    };

    function sortValue(row, index) {
      const cell = row.cells[index];
      return cell.dataset.sortValue ?? cell.querySelector('time')?.dateTime ?? cell.textContent.trim();
    }

    sortButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        const header = button.parentElement;
        const ascending = header.getAttribute('aria-sort') !== 'ascending';
        sortButtons.forEach((other) => other.parentElement.removeAttribute('aria-sort'));
        header.setAttribute('aria-sort', ascending ? 'ascending' : 'descending');
        const rows = [...body.rows].sort((left, right) =>
          (ascending ? 1 : -1) * collator.compare(sortValue(left, index), sortValue(right, index))
        );
        body.append(...rows);
      });
    });

    for (const [selector, className] of [
      ['[data-table-density]', 'compact'],
      ['[data-table-striped]', 'striped'],
    ]) {
      const button = demo.querySelector(selector);
      button.addEventListener('click', () => {
        button.setAttribute('aria-pressed', String(table.classList.toggle(className)));
      });
    }

    stateButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const state = button.dataset.tableState;
        const ready = state === 'ready';
        table.setAttribute('aria-busy', String(state === 'loading'));
        body.hidden = !ready;
        sortButtons.forEach((sortButton) => { sortButton.disabled = !ready; });
        stateButtons.forEach((other) => other.setAttribute('aria-pressed', String(other === button)));
        status.textContent = messages[state];
      });
    });
  });

  document.querySelectorAll('[data-navigation-bar-demo]').forEach((navigation) => {
    const links = [...navigation.querySelectorAll('a')];
    const defaultLink = links.find((link) => link.hasAttribute('aria-current'));

    function updateCurrentLink() {
      const current = links.find((link) => link.hash === window.location.hash) ?? defaultLink;
      links.forEach((link) => {
        if (link === current) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }

    window.addEventListener('hashchange', updateCurrentLink);
    updateCurrentLink();
  });

  document.querySelectorAll('[data-date-time-demo]').forEach((form) => {
    const isRange = form.dataset.dateTimeDemo === 'range';
    const start = form.elements.namedItem(isRange ? 'start' : 'date');
    const end = form.elements.namedItem(isRange ? 'end' : 'time');
    const result = form.querySelector('output');
    const formatDate = new Intl.DateTimeFormat(root.lang, { dateStyle: 'long', timeZone: 'UTC' });
    const fields = [start, end].map((input) => ({
      input,
      message: document.getElementById(input.getAttribute('aria-describedby')),
    }));

    function updateRange() {
      end.min = start.value;
      end.setCustomValidity(end.validity.rangeUnderflow
        ? 'La date de fin doit être égale ou postérieure à la date de début.'
        : '');
    }

    function showError(input, message) {
      input.setAttribute('aria-invalid', 'true');
      message.textContent = input.validationMessage;
      message.hidden = false;
    }

    function updateFields() {
      if (isRange) updateRange();
      result.textContent = '';
      for (const { input, message } of fields) {
        if (input.validity.valid) {
          input.removeAttribute('aria-invalid');
          message.hidden = true;
        } else if (!message.hidden || (isRange && input === end && input.validity.rangeUnderflow)) {
          showError(input, message);
        }
      }
    }

    for (const { input, message } of fields) {
      input.addEventListener('invalid', () => showError(input, message));
    }
    form.addEventListener('input', updateFields);
    form.addEventListener('change', updateFields);
    if (isRange) updateRange();

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (isRange) {
        updateRange();
        if (!form.reportValidity()) return;
      }
      const startLabel = formatDate.format(start.valueAsDate);
      result.textContent = isRange
        ? `Période choisie du ${startLabel} au ${formatDate.format(end.valueAsDate)}.`
        : `Créneau choisi le ${startLabel} à ${end.value}.`;
    });
  });

  document.querySelectorAll('[data-action-menu]').forEach((control) => {
    const trigger = control.querySelector('[aria-haspopup="menu"]');
    const menu = control.querySelector('[role="menu"]');
    const items = [...menu.querySelectorAll('[role="menuitem"]')];
    const status = control.closest('.action-menu-demo').querySelector('[data-action-menu-status]');

    function open(item = items[0]) {
      menu.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
      item.focus();
    }

    function close(restoreFocus = false) {
      if (menu.hidden) return;
      trigger.setAttribute('aria-expanded', 'false');
      if (restoreFocus) trigger.focus();
      menu.hidden = true;
    }

    trigger.addEventListener('click', () => {
      if (menu.hidden) open();
      else close(true);
    });
    trigger.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
      event.preventDefault();
      open(event.key === 'ArrowUp' ? items.at(-1) : items[0]);
    });
    menu.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close(true);
        return;
      }
      if (event.key === 'Tab') {
        setTimeout(() => close(), 0);
        return;
      }
      const index = items.indexOf(document.activeElement);
      const next = {
        ArrowDown: (index + 1) % items.length,
        ArrowUp: (index - 1 + items.length) % items.length,
        Home: 0,
        End: items.length - 1,
      }[event.key];
      if (next === undefined) return;
      event.preventDefault();
      items[next].focus();
    });
    items.forEach((item) => {
      item.addEventListener('click', () => {
        close(true);
        status.textContent = `Action sélectionnée : ${item.textContent.trim()}.`;
      });
    });
    control.addEventListener('focusout', (event) => {
      if (event.relatedTarget && !control.contains(event.relatedTarget)) close();
    });
    document.addEventListener('pointerdown', (event) => {
      if (!control.contains(event.target)) close();
    });
  });

  const calendar = document.querySelector('#calendar-dialog');
  if (calendar) {
    const title = calendar.querySelector('#calendar-title');
    const hint = calendar.querySelector('#calendar-hint');
    const month = calendar.querySelector('#calendar-month');
    const grid = calendar.querySelector('.calendar-grid');
    const weeks = grid.tBodies[0];
    const apply = calendar.querySelector('#calendar-apply');
    const monthFormat = new Intl.DateTimeFormat(root.lang, { month: 'long', year: 'numeric', timeZone: 'UTC' });
    const dateFormat = new Intl.DateTimeFormat(root.lang, { dateStyle: 'long', timeZone: 'UTC' });
    const fieldDateFormat = new Intl.DateTimeFormat(root.lang, { dateStyle: 'medium', timeZone: 'UTC' });
    const fullDateFormat = new Intl.DateTimeFormat(root.lang, { dateStyle: 'full', timeZone: 'UTC' });
    const committed = new Map();
    let trigger;
    let range;
    let current;
    let today;
    let start;
    let end;

    function calendarDate(year, monthIndex, day) {
      const value = new Date(0);
      value.setUTCFullYear(year, monthIndex, day);
      return value;
    }

    function moveDay(date, offset) {
      return calendarDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + offset);
    }

    function moveMonth(date, offset) {
      const year = date.getUTCFullYear();
      const target = date.getUTCMonth() + offset;
      const lastDay = calendarDate(year, target + 1, 0).getUTCDate();
      return calendarDate(year, target, Math.min(date.getUTCDate(), lastDay));
    }

    function renderCalendar(focusDay = false) {
      const year = current.getUTCFullYear();
      const monthIndex = current.getUTCMonth();
      const first = calendarDate(year, monthIndex, 1);
      const offset = (first.getUTCDay() + 6) % 7;
      const count = calendarDate(year, monthIndex + 1, 0).getUTCDate();
      const monthLabel = monthFormat.format(first);
      if (month.textContent !== monthLabel) month.textContent = monthLabel;
      weeks.replaceChildren();

      for (let index = 0; index < Math.ceil((offset + count) / 7) * 7; index++) {
        const row = index % 7 === 0 ? weeks.insertRow() : weeks.lastElementChild;
        const cell = row.insertCell();
        const day = index - offset + 1;
        if (day < 1 || day > count) continue;
        const date = calendarDate(year, monthIndex, day);
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = String(day);
        button.tabIndex = +date === +current ? 0 : -1;
        button.setAttribute('aria-label', fullDateFormat.format(date));
        if (+date === +today) button.setAttribute('aria-current', 'date');
        const endpoint = (start && +date === +start) || (end && +date === +end);
        const inRange = range && start && end && date > start && date < end;
        cell.setAttribute('aria-selected', String(Boolean(endpoint || inRange)));
        if (endpoint) cell.dataset.endpoint = '';
        if (inRange) cell.dataset.inRange = '';
        button.addEventListener('click', () => {
          current = date;
          if (!range || !start || end) {
            start = date;
            end = null;
          } else if (date < start) {
            end = start;
            start = date;
          } else {
            end = date;
          }
          renderCalendar(true);
        });
        cell.append(button);
      }

      apply.disabled = !start || (range && !end);
      const message = start
        ? end
          ? `Du ${dateFormat.format(start)} au ${dateFormat.format(end)}.`
          : range
            ? `Début : ${dateFormat.format(start)}. Choisissez la date de fin.`
            : dateFormat.format(start)
        : range ? 'Choisissez la date de début.' : 'Choisissez un jour.';
      if (hint.textContent !== message) hint.textContent = message;
      if (focusDay) weeks.querySelector('[tabindex="0"]').focus();
    }

    document.querySelectorAll('[data-calendar]').forEach((button) => {
      button.addEventListener('click', () => {
        trigger = button;
        range = button.dataset.calendar === 'range';
        const now = new Date();
        today = calendarDate(now.getFullYear(), now.getMonth(), now.getDate());
        [start, end] = committed.get(button) ?? [null, null];
        current = start ?? today;
        title.textContent = range ? 'Choisir une période' : 'Choisir une date';
        grid.setAttribute('aria-multiselectable', String(range));
        renderCalendar();
        calendar.showModal();
        weeks.querySelector('[tabindex="0"]').focus();
      });
    });

    for (const [id, offset] of [['#calendar-prev', -1], ['#calendar-next', 1]]) {
      calendar.querySelector(id).addEventListener('click', () => {
        current = moveMonth(current, offset);
        renderCalendar();
      });
    }

    grid.addEventListener('keydown', (event) => {
      const weekday = (current.getUTCDay() + 6) % 7;
      switch (event.key) {
        case 'ArrowLeft': current = moveDay(current, -1); break;
        case 'ArrowRight': current = moveDay(current, 1); break;
        case 'ArrowUp': current = moveDay(current, -7); break;
        case 'ArrowDown': current = moveDay(current, 7); break;
        case 'Home': current = moveDay(current, -weekday); break;
        case 'End': current = moveDay(current, 6 - weekday); break;
        case 'PageUp': current = moveMonth(current, event.shiftKey ? -12 : -1); break;
        case 'PageDown': current = moveMonth(current, event.shiftKey ? 12 : 1); break;
        default: return;
      }
      event.preventDefault();
      renderCalendar(true);
    });

    apply.addEventListener('click', () => {
      committed.set(trigger, [start, end]);
      const value = trigger.querySelector('[data-calendar-value]');
      value.textContent = end
        ? `${fieldDateFormat.format(start)} – ${fieldDateFormat.format(end)}`
        : fieldDateFormat.format(start);
      value.removeAttribute('data-empty');
      calendar.close();
    });
    calendar.querySelector('#calendar-cancel').addEventListener('click', () => calendar.close());
    calendar.addEventListener('close', () => trigger.focus());
  }

  document.querySelectorAll('[data-chip-demo]').forEach((demo) => {
    const removable = [...demo.querySelectorAll('[data-chip-remove]')];
    const reset = demo.querySelector('[data-chip-reset]');
    const status = demo.querySelector('[data-chip-status]');

    demo.querySelectorAll('[data-chip-filter]').forEach((chip) => {
      chip.addEventListener('click', () => {
        chip.setAttribute('aria-pressed', String(chip.getAttribute('aria-pressed') !== 'true'));
      });
    });

    removable.forEach((chip, index) => {
      chip.addEventListener('click', () => {
        chip.hidden = true;
        reset.disabled = false;
        const next = removable.slice(index + 1).find((item) => !item.hidden)
          ?? removable.find((item) => !item.hidden)
          ?? reset;
        next.focus();
        status.textContent = `${chip.dataset.chipRemove} retiré de la sélection.`;
      });
    });

    reset.addEventListener('click', () => {
      removable.forEach((chip) => { chip.hidden = false; });
      removable[0].focus();
      reset.disabled = true;
      status.textContent = 'Sélection rétablie.';
    });
  });

  const progressSlider = document.querySelector('#demo-progress-slider');
  if (progressSlider) {
    const sliderValue = document.querySelector('#demo-slider-value');
    const progressBar = document.querySelector('#demo-progress-bar');
    const progressValue = document.querySelector('#demo-progress-value');

    function updateProgress() {
      const label = `${progressSlider.value} %`;
      progressSlider.setAttribute('aria-valuetext', label);
      sliderValue.textContent = label;
      progressBar.value = progressSlider.valueAsNumber;
      progressBar.textContent = label;
      progressValue.textContent = label;
    }

    progressSlider.addEventListener('input', updateProgress);
    updateProgress();
  }

  const spinnerToggle = document.querySelector('#demo-spinner-toggle');
  if (spinnerToggle) {
    const spinner = document.querySelector('#demo-spinner');
    const status = document.querySelector('#demo-spinner-status');
    spinnerToggle.addEventListener('click', () => {
      const loading = spinner.hidden;
      spinner.hidden = !loading;
      status.textContent = loading ? 'Chargement en cours…' : 'Chargement arrêté.';
      spinnerToggle.textContent = loading ? 'Arrêter' : 'Démarrer';
    });
  }

  document.querySelectorAll('[data-file-uploader]').forEach((uploader) => {
    const input = uploader.querySelector('input[type="file"]');
    const dropzone = uploader.querySelector('.upload-dropzone');
    const list = uploader.querySelector('.upload-list');
    const template = uploader.querySelector('template');
    const status = uploader.querySelector('[data-upload-status]');
    const errors = uploader.querySelector('[data-upload-errors]');
    const acceptedTypes = input.accept.split(',');
    const maxBytes = Number(uploader.dataset.maxBytes);
    const maxFiles = Number(uploader.dataset.maxFiles);
    const sizeFormat = new Intl.NumberFormat(root.lang, { maximumFractionDigits: 1 });
    const files = new Map();

    function describeSize(bytes) {
      return bytes >= 1_000_000
        ? `${sizeFormat.format(bytes / 1_000_000)} Mo`
        : `${sizeFormat.format(bytes / 1_000)} ko`;
    }

    function validationError(file, key) {
      if (!acceptedTypes.includes(file.type)) return 'format non accepté';
      if (file.size > maxBytes) return 'fichier trop volumineux';
      if (files.has(key)) return 'fichier déjà sélectionné';
      if (files.size >= maxFiles) return 'nombre maximal de fichiers atteint';
      return '';
    }

    function appendFile(file, key) {
      const row = template.content.firstElementChild.cloneNode(true);
      row.querySelector('[data-upload-name]').textContent = file.name;
      row.querySelector('[data-upload-size]').textContent = describeSize(file.size);
      const preview = row.querySelector('.upload-preview');
      const type = preview.querySelector('[data-upload-type]');
      let previewURL;
      if (file.type.startsWith('image/')) {
        previewURL = URL.createObjectURL(file);
        const image = document.createElement('img');
        image.alt = '';
        image.addEventListener('error', () => {
          image.remove();
          type.hidden = false;
        }, { once: true });
        type.hidden = true;
        image.src = previewURL;
        preview.append(image);
      } else {
        type.textContent = 'PDF';
      }

      const remove = row.querySelector('[data-upload-remove]');
      remove.setAttribute('aria-label', `Retirer ${file.name}`);
      remove.addEventListener('click', () => {
        const neighbor = row.nextElementSibling ?? row.previousElementSibling;
        files.delete(key);
        row.remove();
        if (previewURL) URL.revokeObjectURL(previewURL);
        list.hidden = files.size === 0;
        errors.replaceChildren();
        status.textContent = `${file.name} retiré de la sélection.`;
        (neighbor?.querySelector('[data-upload-remove]') ?? input).focus();
      });

      files.set(key, file);
      list.append(row);
    }

    function addFiles(selected) {
      errors.replaceChildren();
      let added = 0;
      for (const file of selected) {
        const key = JSON.stringify([file.name, file.size, file.lastModified]);
        const error = validationError(file, key);
        if (error) {
          const item = document.createElement('li');
          item.textContent = `${file.name} : ${error}.`;
          errors.append(item);
        } else {
          appendFile(file, key);
          added++;
        }
      }
      list.hidden = files.size === 0;
      status.textContent = added === 1 ? '1 fichier ajouté.' : added ? `${added} fichiers ajoutés.` : '';
    }

    input.addEventListener('change', () => {
      addFiles(input.files);
      input.value = '';
    });
    dropzone.addEventListener('dragover', (event) => {
      if (!Array.from(event.dataTransfer.types).includes('Files')) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy';
      dropzone.dataset.dragging = '';
    });
    dropzone.addEventListener('dragleave', (event) => {
      if (!dropzone.contains(event.relatedTarget)) delete dropzone.dataset.dragging;
    });
    dropzone.addEventListener('drop', (event) => {
      event.preventDefault();
      delete dropzone.dataset.dragging;
      if (event.dataTransfer.files.length) addFiles(event.dataTransfer.files);
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

  document.querySelectorAll('[data-chart]').forEach((chart) => {
    const kind = chart.dataset.chart;
    const rows = [...chart.querySelectorAll({
      line: '.chart-data tbody tr',
      bar: '.chart-bars > div',
      donut: '.chart-legend > div',
    }[kind])];
    const marks = [...chart.querySelectorAll({
      line: '.chart-points circle',
      bar: '.chart-bars > div',
      donut: '.chart-donut path',
    }[kind])];

    const readout = document.createElement('div');
    readout.className = 'chart-readout';
    readout.setAttribute('aria-hidden', 'true');
    const value = document.createElement('span');
    value.className = 'chart-value';
    value.hidden = true;
    readout.append(value);
    chart.querySelector('figcaption').after(readout);

    const labels = rows.map((row) => {
      const [label, amount] = [...row.children].map((cell) => cell.textContent.trim());
      return kind === 'donut' ? `${label} · ${amount}` : `${label} · ${amount} commandes`;
    });

    // Reserve room for wrapped labels so the plot stays under the pointer.
    labels.forEach((label) => {
      const placeholder = document.createElement('span');
      placeholder.className = 'chart-value chart-readout-placeholder';
      placeholder.textContent = label;
      readout.append(placeholder);
    });

    const pointTargets = chart.querySelector('[data-chart-points]');
    const focusTargets = rows.map((row, index) => {
      if (kind === 'line') {
        const target = document.createElement('button');
        target.type = 'button';
        target.setAttribute('aria-label', labels[index]);
        pointTargets.append(target);
        return target;
      }
      row.tabIndex = 0;
      return row;
    });

    const targets = new Map(focusTargets.map((target, index) => [target, index]));
    if (kind === 'donut') marks.forEach((mark, index) => targets.set(mark, index));
    targets.forEach((_, target) => target.setAttribute('data-chart-point', ''));

    let activeIndex;
    const show = (index) => {
      if (index === activeIndex) return;
      marks[activeIndex]?.removeAttribute('data-active');
      if (kind === 'donut') focusTargets[activeIndex]?.removeAttribute('data-active');
      activeIndex = index;
      value.hidden = index === undefined;
      if (index === undefined) return;
      value.textContent = labels[index];
      marks[index].setAttribute('data-active', '');
      if (kind === 'donut') focusTargets[index].setAttribute('data-active', '');
    };

    const findIndex = (node) => targets.get(node?.closest?.('[data-chart-point]'));
    const focusedIndex = () => chart.contains(document.activeElement) &&
      document.activeElement.matches(':focus-visible') ? findIndex(document.activeElement) : undefined;

    chart.addEventListener('pointermove', (event) => {
      const target = event.pointerType === 'touch'
        ? document.elementFromPoint(event.clientX, event.clientY)
        : event.target;
      show(findIndex(target) ?? focusedIndex());
    });
    chart.addEventListener('pointerleave', (event) => {
      if (event.pointerType !== 'touch') show(focusedIndex());
    });
    chart.addEventListener('pointercancel', () => show(focusedIndex()));
    chart.addEventListener('focusin', (event) => show(findIndex(event.target)));
    chart.addEventListener('focusout', (event) => show(findIndex(event.relatedTarget)));
    document.addEventListener('pointerdown', (event) => show(findIndex(event.target)));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') show(undefined);
    });
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
