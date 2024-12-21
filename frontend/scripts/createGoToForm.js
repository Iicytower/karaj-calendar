import { insertCalendar } from './calendarView/calendar.js';
import { getCurrentLanguage, getFirstDayOfMonth } from './helpers.js';

const goToDateInputCallback = (event) => {
  const lastKey = localStorage.getItem('lastKeyInGoToDateInput');
  if (lastKey === 'Backspace' || lastKey === 'Delete') {
    return;
  }

  let value = event.srcElement.value;

  if (/\D/g.test(lastKey) && lastKey !== 'v') {
    event.srcElement.value = value.slice(0, value.length - 1);
  }

  if (event.srcElement.id === 'goToYearInput' && value.length === 4) {
    document.getElementById('goToMonthInput').focus();
  }

  if (event.srcElement.id === 'goToMonthInput' && value.length === 2) {
    document.getElementById('goToDayInput').focus();
  }
}

const goToDateKeydownCallbackWrapper = (calendarDb) => {
  return (event) => {
    localStorage.setItem('lastKeyInGoToDateInput', event.key);
    if (event.type == 'keydown' && event.key != 'Enter') {
      if (event.key === 'Backspace') {
        if (event.srcElement.id === 'goToMonthInput' && event.srcElement.value.length === 0) {
          document.getElementById('goToYearInput').focus();
        }
        if (event.srcElement.id === 'goToDayInput' && event.srcElement.value.length === 0) {
          document.getElementById('goToMonthInput').focus();
        }
      }
      return;
    }

    const year = document.getElementById('goToYearInput').value;
    const month = document.getElementById('goToMonthInput').value;
    const day = document.getElementById('goToDayInput').value;
    const goToDateInputValue = `${year}-${month}-${day}`;

    const gregOrKaraj = (Number(year) > 5000) ? 'KARAJ' : 'GREG';

    let dateToSearch = (gregOrKaraj === 'KARAJ') ? calendarDb.getGregDate(goToDateInputValue) : goToDateInputValue;

    const calendarData = calendarDb.getMonthWithFullWeeks(dateToSearch);
    insertCalendar(calendarData, calendarDb.getClosestHolidays());
    localStorage.setItem('currentMonthInView', getFirstDayOfMonth(calendarData[9].karajDate));
  }
}

export function createGoToForm(calendarDb) {
  const goToDateFormTexts = {
    text: 'Idź do:',
    placeholder: {
      year: 'yyyy',
      month: 'mm',
      day: 'dd',
    },
  }

  switch (getCurrentLanguage()) {
    case 'pl':
      goToDateFormTexts.text = 'Idź do: ';
      goToDateFormTexts.placeholder.year = 'rrrr';
      goToDateFormTexts.placeholder.month = 'mm';
      goToDateFormTexts.placeholder.day = 'dd';
      break;
    case 'ru':
      goToDateFormTexts.text = 'Иди к: ';
      goToDateFormTexts.placeholder.year = 'гггг';
      goToDateFormTexts.placeholder.month = 'мм';
      goToDateFormTexts.placeholder.day = 'дд';
      break;
    case 'lt':
      goToDateFormTexts.text = 'Eik į: ';
      goToDateFormTexts.placeholder.year = 'mmmm';
      goToDateFormTexts.placeholder.month = 'mm';
      goToDateFormTexts.placeholder.day = 'dd';
      break;
    case 'en':
      goToDateFormTexts.text = 'Go to: ';
      goToDateFormTexts.placeholder.year = 'yyyy';
      goToDateFormTexts.placeholder.month = 'mm';
      goToDateFormTexts.placeholder.day = 'dd';
      break;
    case 'kar':
      goToDateFormTexts.text = 'Bar: ';
      goToDateFormTexts.placeholder.year = 'jjjj';
      goToDateFormTexts.placeholder.month = 'aa';
      goToDateFormTexts.placeholder.day = 'kk';
      break;
  }

  const goToDateBtn = document.createElement('button');
  goToDateBtn.id = 'goToDateBtn';
  goToDateBtn.textContent = goToDateFormTexts.text;

  const goToYearInput = document.createElement('input');
  goToYearInput.type = 'text';
  goToYearInput.classList.add('goToDateInput');
  goToYearInput.id = 'goToYearInput';
  goToYearInput.placeholder = goToDateFormTexts.placeholder.year;
  goToYearInput.maxLength = 4;

  const goToMonthInput = document.createElement('input');
  goToMonthInput.type = 'text';
  goToMonthInput.classList.add('goToDateInput');
  goToMonthInput.id = 'goToMonthInput';
  goToMonthInput.placeholder = goToDateFormTexts.placeholder.month;
  goToMonthInput.maxLength = 2;

  const goToDayInput = document.createElement('input');
  goToDayInput.type = 'text';
  goToDayInput.classList.add('goToDateInput');
  goToDayInput.id = 'goToDayInput';
  goToDayInput.placeholder = goToDateFormTexts.placeholder.day;
  goToDayInput.maxLength = 2;

  const wrapperEl = document.createElement('div');

  wrapperEl.appendChild(goToYearInput);
  wrapperEl.appendChild(document.createTextNode('-'));
  wrapperEl.appendChild(goToMonthInput);
  wrapperEl.appendChild(document.createTextNode('-'));
  wrapperEl.appendChild(goToDayInput);

  goToDateBtn.addEventListener('click', goToDateKeydownCallbackWrapper(calendarDb));
  goToYearInput.addEventListener('keydown', goToDateKeydownCallbackWrapper(calendarDb));
  goToMonthInput.addEventListener('keydown', goToDateKeydownCallbackWrapper(calendarDb));
  goToDayInput.addEventListener('keydown', goToDateKeydownCallbackWrapper(calendarDb));
  goToYearInput.addEventListener('input', goToDateInputCallback);
  goToMonthInput.addEventListener('input', goToDateInputCallback);
  goToDayInput.addEventListener('input', goToDateInputCallback);

  const container = document.createElement('div');

  container.classList.add('goToForm');

  container.appendChild(goToDateBtn);
  container.appendChild(wrapperEl);
  // container.appendChild(goToYearInput);
  // container.appendChild(document.createTextNode('-'));
  // container.appendChild(goToMonthInput);
  // container.appendChild(document.createTextNode('-'));
  // container.appendChild(goToDayInput);

  return container;
}