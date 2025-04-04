import { replaceDiacriticalMarks } from './helpers.js';

export function showPopup(input) {
  const popup = document.querySelector('#popup');
  popup.style.display = 'block';
  document.querySelector('main').classList.add('afterPopUp');

  const closeBtn = popup.querySelector('div');
  closeBtn.onclick = hidePopup;

  popup.querySelector('.popupArticle').innerHTML = input;
  popup.querySelector('.popupArticle').scrollTop = 0;
}

export function hidePopup() {
  document.querySelector('#popup').style.display = 'none';
  document.querySelector('main').classList.remove('afterPopUp');
  document.querySelector("#popup > .popupArticle").innerHTML = '';
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
    .replace('<<KarajDate>>', closestHolidays[karHolidayName.toLowerCase()]?.karajDate)
    .replace('<<GregDate>>', closestHolidays[karHolidayName.toLowerCase()]?.gregDate);

  let article = `
  <p class="holidayTitle">${holidayTitle}</p>
  `;

  if (!doesItArticle) {
    const keyInStore = replaceDiacriticalMarks(karHolidayName).replace(' ', '_');
    article = article + `<p>${closestDate}: <b>${closestHolidays[keyInStore].karajDate} | ${closestHolidays[keyInStore].gregDate}</b></p>`;
  }

  article = article + `<div class="">${description}</div>`;

  const sources = (articleSources ?? []).map(item => `<p class="articleSource">${item}</p>`).join('');

  const popupContent = article + sources;

  return popupContent;
}