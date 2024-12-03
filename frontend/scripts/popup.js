import { replaceDiacriticalMarks } from './helpers.js';

export function showPopup(input) {
  const popup = document.querySelector('#popup');
  popup.style.display = 'block';
  document.querySelector('main').classList.add('afterPopUp');

  const closeBtn = popup.querySelector('div');
  closeBtn.onclick = hidePopup;

  popup.querySelector('.popupArticle').innerHTML = input;
}

export function hidePopup() {
  document.querySelector('#popup').style.display = 'none';
  document.querySelector('main').classList.remove('afterPopUp');
}

export function createPopupInnerHTML(input) {
  const { 
    descriptionTemplate,
    closestHolidays,
    karHolidayName,
    holidayTitle,
    doesItArticle,
    closestDate,
    articleSources,
  } = input;

  const description = descriptionTemplate
    .replace('<<KarajDate>>', closestHolidays[karHolidayName]?.karajDate)
    .replace('<<GregDate>>', closestHolidays[karHolidayName]?.gregDate);

  let article = `
  <p class="holidayTitle">${holidayTitle}</p>
  `;

  if (!doesItArticle) {
    const keyInStore = replaceDiacriticalMarks(karHolidayName).replace(' ', '_');
    article = article + `<p>${closestDate}: <b>${closestHolidays[keyInStore].karajDate} | ${closestHolidays[keyInStore].gregDate}</b></p>`;
  }

  article = article + `<div class="scrollable">${description}</div>`;

  const sources = (articleSources ?? []).map(item => `<p class="articleSource">${item}</p>`).join('');

  const popupContent = article + sources;

  return popupContent;
}