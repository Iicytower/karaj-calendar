import { insertCalendar } from './calendarView/calendar.js';
import { getCurrentLanguage, getFirstDayOfMonth } from './helpers.js';

const goToDateInputCallback = (event) => {
  const lastKey = localStorage.getItem('lastKeyInGoToDateInput');
  if(lastKey === 'Backspace' || lastKey === 'Delete') {
    return;
  }
  
  let value = event.srcElement.value;

  if(/\D/g.test(lastKey) && lastKey !== 'v') {
    event.srcElement.value = value.slice(0, value.length - 1);
  }

  if (value.length === 4) {
    event.srcElement.value = value + '-'
  }

  if (value.length === 7) {
    event.srcElement.value = value + '-'
  }
}

const goToDateKeydownCallbackWrapper = (calendarDb) => {
  return (event) => {
    localStorage.setItem('lastKeyInGoToDateInput', event.key);
    if(event.type == 'keydown' && event.key != 'Enter') {
      return;
    }
  
    const gregOrKaraj = (Number(goToDateInput.value.split('-')[0]) > 5000) ? 'KARAJ' : 'GREG';
  
    let dateToSearch = (gregOrKaraj === 'KARAJ') ? calendarDb.getGregDate(goToDateInput.value) : goToDateInput.value;
  
    const calendarData = calendarDb.getMonthWithFullWeeks(dateToSearch);
    insertCalendar(calendarData);
    localStorage.setItem('currentMonthInView', getFirstDayOfMonth(calendarData[9].karajDate));
  }
}

export function createGoToForm(calendarDb) {
  const goToDateFormTexts = {
    text: 'Idź do:',
    placeholder: 'rrrr-mm-dd',
  }

  switch (getCurrentLanguage()) {
    case 'pl':
      goToDateFormTexts.text = 'Idź do: ';
      goToDateFormTexts.placeholder = 'rrrr-mm-dd';
      break;
    case 'ru':
      goToDateFormTexts.text = 'Иди к: ';
      goToDateFormTexts.placeholder = 'гггг-мм-дд';
      break;
    case 'lt':
      goToDateFormTexts.text = 'Eik į: ';
      goToDateFormTexts.placeholder = 'mmmm-mm-dd';
      break;
    case 'en':
      goToDateFormTexts.text = 'Go to: ';
      goToDateFormTexts.placeholder = 'yyyy-mm-dd';
      break;
    case 'kar':
      goToDateFormTexts.text = 'Bar: ';
      goToDateFormTexts.placeholder = 'jjjj-aa-kk';
      break;
  }

  const goToDateBtn = document.createElement('button');
  goToDateBtn.id = 'goToDateBtn';
  goToDateBtn.textContent = goToDateFormTexts.text;

  const goToDateInput = document.createElement('input');
  goToDateInput.type = 'go to';
  goToDateInput.classList.add('goToDateInput');
  goToDateInput.id = 'goToDateInput';
  goToDateInput.placeholder = goToDateFormTexts.placeholder;

  goToDateBtn.addEventListener('click', goToDateKeydownCallbackWrapper(calendarDb));
  goToDateInput.addEventListener('keydown', goToDateKeydownCallbackWrapper(calendarDb));
  goToDateInput.addEventListener('input', goToDateInputCallback);

  const container = document.createElement('div');

  container.appendChild(goToDateBtn);
  container.appendChild(goToDateInput);

  return container;
}