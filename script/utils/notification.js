export function dialogToast(main, secondary = '', timeoutID) {
  clearTimeout(timeoutID);
  document.querySelector('.js-dialog-toast').classList.add('show');
  document.querySelector('.js-dialog-toast-main').textContent = main;
  document.querySelector('.js-dialog-toast-secondary').textContent = secondary;

  return setTimeout(() => {
    document.querySelector('.js-dialog-toast').classList.remove('show');
  }, 3000);
}