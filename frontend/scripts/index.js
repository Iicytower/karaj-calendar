import { Calendar } from './calendarData/calendar.js';
import { insertCalendar } from './calendarView/calendar.js';
import { createMenu } from './createMenu.js';
import { getFirstDayOfMonth, readJSONFile, verifyDate } from './helpers.js';
import { hidePopup } from './popup.js';

const gregToKarajBtn = document.querySelector('#gregToKarajBtn');
const karajToGregBtn = document.querySelector('#karajToGregBtn');
const nextMonthBtn = document.querySelector("#nextMonth");
const previousMonthBtn = document.querySelector("#previousMonth");
const goToDateInput = document.querySelector('#goToDateInput');
const goToDateBtn = document.querySelector('#goToDateBtn');
const monthNameElement = document.querySelector('#monthName');
const yearElement = document.querySelector('#year');
const gregToKarajInput = document.querySelector("#gregToKarajInput");
const karajToGregInput = document.querySelector("#karajToGregInput");
const menuBtn = document.querySelector('#menuBtn');
const calendarBlock = document.querySelector('#calendarBlock');
const calendarContainer = document.querySelector('#calendarContainer');

let calendarDb;
let currentMonthInView;
let touchStartX = 0;
let touchEndX = 0;

window.onload = async () => {
  calendarDb = await Calendar.init();

  const currentMonthCalendarData = calendarDb.getMonthWithFullWeeks();

  insertCalendar(currentMonthCalendarData, monthNameElement, yearElement);

  setCurrentMonthInView(getFirstDayOfMonth(currentMonthCalendarData[9].karajDate));

  if (!localStorage.getItem('language')) {
    localStorage.setItem('language', 'pl')
  }
}

const gregToKarajCallback = (event) => {
  if(event.type == 'keydown' && event.key != 'Enter') {
    return;
  }

  try{
    const gregToKarajInput = document.querySelector('#gregToKarajInput');
  
    const gregDate = gregToKarajInput.value;
  
    if (!verifyDate(gregDate)) throw new Error('wrong date');
  
    const karajDate = calendarDb.getKarajDate(gregDate)
    const answerField = document.querySelector("#translateContainer > div.translateDate.translateGregToKaraj > p.result")
    answerField.innerHTML = karajDate;
  } catch(error) {
    const answerField = document.querySelector("#translateContainer > div.translateDate.translateGregToKaraj > p.result")
    answerField.innerHTML = error.message;
  }
}

const karajToGregCallback = (event) => {
  if(event.type == 'keydown' && event.key != 'Enter') {
    return;
  }
  
  try{
    const karajToGregInput = document.querySelector('#karajToGregInput');
  
    const gregDate = karajToGregInput.value;
  
    if (!verifyDate(gregDate)) throw new Error('wrong date');
  
    const karajDate = calendarDb.getGregDate(gregDate)

    const answerField = document.querySelector("#translateContainer > div.translateDate.translateKarajToGreg > p.result")
    answerField.innerHTML = karajDate;
  } catch(error) {
    const answerField = document.querySelector("#translateContainer > div.translateDate.translateKarajToGreg > p.result")
    answerField.innerHTML = error.message;
  }
}

const goToDateKeydownCallback = (event) => {
  localStorage.setItem('lastKeyInGoToDateInput', event.key);
  if(event.type == 'keydown' && event.key != 'Enter') {
    return;
  }

  const gregOrKaraj = (Number(goToDateInput.value.split('-')[0]) > 5000) ? 'KARAJ' : 'GREG';

  let dateToSearch = (gregOrKaraj === 'KARAJ') ? calendarDb.getGregDate(goToDateInput.value) : goToDateInput.value;

  const calendarData = calendarDb.getMonthWithFullWeeks(dateToSearch);
  insertCalendar(calendarData, monthNameElement, yearElement);
  currentMonthInView = getFirstDayOfMonth(calendarData[9].karajDate);
}

const goToDateInputCallback = () => {
  const lastKey = localStorage.getItem('lastKeyInGoToDateInput');
  if(lastKey === 'Backspace' || lastKey === 'Delete') {
    return;
  }
  
  let value = goToDateInput.value;

  if(/\D/g.test(lastKey) && lastKey !== 'v') {
    goToDateInput.value = value.slice(0, value.length - 1);
  }

  if (value.length === 4) {
    goToDateInput.value = value + '-'
  }

  if (value.length === 7) {
    goToDateInput.value = value + '-'
  }
}

const previousMonthCallback = () => {
  const firstDayOfPreviousMonth = calendarDb.getFirstDayOfPreviousMonth(currentMonthInView);

  const calendarData = calendarDb.getMonthWithFullWeeks(calendarDb.getGregDate(firstDayOfPreviousMonth));

  const doesItMarginalDate = setCurrentMonthInView(getFirstDayOfMonth(calendarData[9].karajDate));
  if(doesItMarginalDate) insertCalendar(calendarData, monthNameElement, yearElement);
}

const nextMonthCallback = () => {
  const firstDayOfNextMonth = calendarDb.getFirstDayOfNextMonth(currentMonthInView);

  const calendarData = calendarDb.getMonthWithFullWeeks(calendarDb.getGregDate(firstDayOfNextMonth));

  const doesItMarginalDate = setCurrentMonthInView(getFirstDayOfMonth(calendarData[8].karajDate));
  if(doesItMarginalDate) insertCalendar(calendarData, monthNameElement, yearElement);
}

gregToKarajBtn.addEventListener('click', gregToKarajCallback);
gregToKarajInput.addEventListener('keydown', gregToKarajCallback);
karajToGregBtn.addEventListener('click', karajToGregCallback);
karajToGregInput.addEventListener('keydown', karajToGregCallback);
goToDateInput.addEventListener('keydown', goToDateKeydownCallback);
goToDateInput.addEventListener('input', goToDateInputCallback);
goToDateBtn.addEventListener('click', goToDateKeydownCallback);
previousMonthBtn.addEventListener('click', previousMonthCallback);
nextMonthBtn.addEventListener('click', nextMonthCallback);

function setCurrentMonthInView(date) {
  const gregDate = calendarDb.getGregDate(date);

  if (
    new Date(gregDate).getTime() < new Date('1997-04-09').getTime() ||
    new Date(gregDate).getTime() >= new Date('2439-03-17').getTime()
  ) {
    return false;
  }
  currentMonthInView = date;
  return true;
}

calendarBlock.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
});

calendarBlock.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].clientX;
  handleGesture();
});

menuBtn.addEventListener('click', async () => {
  const dropdownMenu = document.querySelector('.dropdown-menu');
  dropdownMenu.classList.toggle('show');

  dropdownMenu.innerHTML = '';

  const menu = await createMenu();

  dropdownMenu.appendChild(menu);
});

function handleGesture() {
  const SWIPE_THRESHOLD = 100;
    const deltaX = touchEndX - touchStartX;
    if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
      (deltaX > 0) ? previousMonthCallback() : nextMonthCallback();
    }
}

calendarContainer.addEventListener('click', () => {
  hidePopup();
  const dropdownMenu = document.querySelector('.dropdown-menu');
  dropdownMenu.classList.remove('show');
})
// menuBtn.onclick = showPopup;

