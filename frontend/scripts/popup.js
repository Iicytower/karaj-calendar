export function showPopup() {
  const popup = document.querySelector('#popup');
  popup.style.display = 'block';
  document.querySelector('#calendarContainer').classList.add('afterPopUp');

  const closeBtn = popup.querySelector('div');
  closeBtn.onclick = hidePopup;

  return popup;
}

export function hidePopup() {
  document.querySelector('#popup').style.display = 'none';
  document.querySelector('#calendarContainer').classList.remove('afterPopUp');
}