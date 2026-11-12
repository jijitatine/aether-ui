export function setupPagination(root, { onChange, unit = 'résultats' }) {
  const range = root.querySelector('.pagination-range');
  const position = root.querySelector('.pagination-position');
  const pages = root.querySelector('.pagination-pages');
  const previous = root.querySelector('[data-page-prev]');
  const next = root.querySelector('[data-page-next]');
  const size = root.querySelector('select');
  let page = 1;
  let pageCount = 1;

  function go(target) {
    page = target;
    onChange();
  }

  previous.addEventListener('click', () => go(page - 1));
  next.addEventListener('click', () => go(page + 1));
  size.addEventListener('change', () => go(1));

  return {
    reset() { page = 1; },
    slice(items) {
      const perPage = Number(size.value);
      pageCount = Math.max(1, Math.ceil(items.length / perPage));
      page = Math.min(page, pageCount);
      const start = (page - 1) * perPage;
      const end = Math.min(start + perPage, items.length);
      root.hidden = items.length === 0;
      previous.disabled = page === 1;
      next.disabled = page === pageCount;
      position.textContent = 'Page ' + page + ' sur ' + pageCount;
      const message = items.length ? (start + 1) + '–' + end + ' sur ' + items.length + ' ' + unit : '';
      if (range.textContent !== message) range.textContent = message;

      const focusedPage = document.activeElement?.dataset.pageNumber;
      const current = document.activeElement;
      pages.replaceChildren();
      const first = Math.max(1, Math.min(page - 2, pageCount - 4));
      for (let number = first; number <= Math.min(first + 4, pageCount); number++) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'button secondary';
        button.dataset.pageNumber = String(number);
        button.textContent = number;
        button.setAttribute('aria-label', 'Page ' + number);
        if (number === page) button.setAttribute('aria-current', 'page');
        button.addEventListener('click', () => go(number));
        pages.append(button);
      }
      if (focusedPage) {
        (pages.querySelector('[data-page-number="' + focusedPage + '"]') ?? next).focus();
      } else if ((current === previous && previous.disabled) || (current === next && next.disabled)) {
        (current === previous ? next : previous).focus();
      }
      return items.slice(start, end);
    }
  };
}
