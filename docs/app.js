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
