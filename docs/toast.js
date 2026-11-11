export function createToast() {
  const container = document.createElement('div');
  container.innerHTML = `
  <div class="sr-only" role="status"></div>
  <div class="sr-only" role="alert"></div>
  <div class="feedback feedback-toast" hidden>
    <span class="feedback-icon" aria-hidden="true"></span>
    <div class="feedback-copy"><strong></strong><p></p></div>
    <button class="feedback-close" type="button" aria-label="Fermer la notification">×</button>
  </div>
  `;
  document.body.append(container);
  const [toastStatus, toastUrgent, toast] = container.children;
  const toastIcons = { info: 'i', success: '✓', warning: '!', danger: '×' };
  let toastTimer;
  let toastTrigger;

  const hideToast = () => {
    clearTimeout(toastTimer);
    const restoreFocus = toast.contains(document.activeElement);
    toast.hidden = true;
    if (restoreFocus && toastTrigger?.isConnected) toastTrigger.focus();
  };

  const scheduleToastDismissal = () => {
    clearTimeout(toastTimer);
    if (!toast.hidden && ['info', 'success'].includes(toast.dataset.tone)
        && !toast.matches(':hover, :focus-within')) {
      toastTimer = setTimeout(hideToast, 6000);
    }
  };

  const showToast = (trigger, tone, title, message = '') => {
    toastTrigger = trigger;
    toast.dataset.tone = tone;
    toast.querySelector('.feedback-icon').textContent = toastIcons[tone];
    toast.querySelector('strong').textContent = title;
    const detail = toast.querySelector('p');
    detail.textContent = message;
    detail.hidden = !message;
    toast.hidden = false;
    toastStatus.textContent = '';
    toastUrgent.textContent = '';
    const announcement = tone === 'danger' ? toastUrgent : toastStatus;
    announcement.append(message ? title + '. ' + message : title);
    scheduleToastDismissal();
  };

  toast.querySelector('button').addEventListener('click', hideToast);
  toast.addEventListener('pointerenter', () => clearTimeout(toastTimer));
  toast.addEventListener('pointerleave', scheduleToastDismissal);
  toast.addEventListener('focusin', () => clearTimeout(toastTimer));
  toast.addEventListener('focusout', () => queueMicrotask(scheduleToastDismissal));

  return showToast;
}
