export function setupStepper(form, { validate = (panel) =>
  [...panel.querySelectorAll('input')].every(input => input.reportValidity()), review = () => {} } = {}) {
  const nav = form.querySelector('[data-stepper-nav]');
  const buttons = [...nav.querySelectorAll('[data-stepper-jump]')];
  const position = nav.querySelector('[data-stepper-position]');
  const panels = [...form.querySelectorAll('[data-stepper-panel]')];
  const back = form.querySelector('[data-stepper-back]');
  const submit = form.querySelector('[type="submit"]');
  const finalLabel = submit.textContent;
  let enabled = true;
  let current = 0;

  function show(index, moveFocus = false) {
    current = index;
    nav.hidden = !enabled;
    panels.forEach((panel, step) => {
      panel.hidden = enabled ? step !== index : step === panels.length - 1;
    });
    buttons.forEach((button, step) => {
      button.disabled = step >= index;
      if (step === index) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
    position.textContent = 'Étape ' + (index + 1) + ' sur ' + panels.length
      + ' · ' + buttons[index].lastChild.textContent.trim();
    back.hidden = !enabled || index === 0;
    submit.textContent = enabled && index < panels.length - 1 ? 'Suivant' : finalLabel;
    if (enabled && index === panels.length - 1) review();
    if (moveFocus) panels[index].focus();
  }

  panels.forEach((panel, index) => {
    panel.tabIndex = -1;
    panel.setAttribute('role', 'group');
    panel.setAttribute('aria-label', buttons[index].lastChild.textContent.trim());
  });
  back.addEventListener('click', () => show(current - 1, true));
  buttons.forEach((button, index) => button.addEventListener('click', () => show(index, true)));

  return {
    reset(useSteps = true) {
      enabled = useSteps;
      show(0);
    },
    readyToSubmit() {
      if (!enabled) return true;
      if (current === panels.length - 1) return true;
      if (validate(panels[current])) show(current + 1, true);
      return false;
    }
  };
}

export function updateStepperSummary(form, values) {
  for (const element of form.querySelectorAll('[data-stepper-summary]')) {
    element.textContent = values[element.dataset.stepperSummary];
  }
}
