import { Calendar } from './calendarData/calendar.js';
import { insertCalendar } from './calendarView/calendar.js';
import { createGoToForm } from './createGoToForm.js';
import { createMenu } from './createMenu.js';
import { getCurrentLanguage, getCurrentMonthInView, getFirstDayOfMonth, setCurrentMonthInView, verifyDate } from './helpers.js';
import { hidePopup } from './popup.js';

let calendarDb;
let touchStartX = 0;
let touchEndX = 0;

window.onload = async () => {
  if (!getCurrentLanguage()) {
    localStorage.setItem('language', 'kar')
  }
  
  calendarDb = await Calendar.init();

  const currentMonthCalendarData = calendarDb.getMonthWithFullWeeks();

  await insertCalendar(currentMonthCalendarData, calendarDb.getClosestHolidays());

  setCurrentMonthInView(calendarDb, getFirstDayOfMonth(currentMonthCalendarData[9].karajDate));

  searchBar.appendChild(createGoToForm(calendarDb));
}

const gregToKarajBtn = document.querySelector('#gregToKarajBtn');
const karajToGregBtn = document.querySelector('#karajToGregBtn');
const nextMonthBtn = document.querySelector("#nextMonth");
const previousMonthBtn = document.querySelector("#previousMonth");
const gregToKarajInput = document.querySelector("#gregToKarajInput");
const karajToGregInput = document.querySelector("#karajToGregInput");
const menuBtn = document.querySelector('#menuBtn');
const calendarBlock = document.querySelector('#calendarBlock');
const calendarContainer = document.querySelector('#calendarContainer');
const searchBar = document.querySelector('.searchBar');

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

const previousMonthCallback = async () => {
  const firstDayOfPreviousMonth = calendarDb.getFirstDayOfPreviousMonth(getCurrentMonthInView());

  const calendarData = calendarDb.getMonthWithFullWeeks(calendarDb.getGregDate(firstDayOfPreviousMonth));

  const doesItMarginalDate = setCurrentMonthInView(calendarDb, getFirstDayOfMonth(calendarData[9].karajDate));
  if(doesItMarginalDate) await insertCalendar(calendarData, calendarDb.getClosestHolidays());
}

const nextMonthCallback = async () => {
  const firstDayOfNextMonth = calendarDb.getFirstDayOfNextMonth(getCurrentMonthInView());

  const calendarData = calendarDb.getMonthWithFullWeeks(calendarDb.getGregDate(firstDayOfNextMonth));

  const doesItMarginalDate = setCurrentMonthInView(calendarDb, getFirstDayOfMonth(calendarData[8].karajDate));
  if(doesItMarginalDate) await insertCalendar(calendarData, calendarDb.getClosestHolidays());
}

const menuBtnCallback = async () => {
  const dropdownMenu = document.querySelector('.dropdown-menu');
  dropdownMenu.style.display = 'block'
  
  dropdownMenu.innerHTML = '';
  
  const menu = await createMenu(calendarDb.getClosestHolidays());
  
  dropdownMenu.appendChild(menu);
};

gregToKarajBtn.addEventListener('click', gregToKarajCallback);
gregToKarajInput.addEventListener('keydown', gregToKarajCallback);
karajToGregBtn.addEventListener('click', karajToGregCallback);
karajToGregInput.addEventListener('keydown', karajToGregCallback);
previousMonthBtn.addEventListener('click', previousMonthCallback);
nextMonthBtn.addEventListener('click', nextMonthCallback);
menuBtn.addEventListener('click', menuBtnCallback);
// closing dropdown-menu on any outside click
document.addEventListener('click', (event) => {
  const dropdownMenu = document.querySelector('.dropdown-menu');
  if (dropdownMenu.contains(event.target) || menuBtn.contains(event.target)) return;

  dropdownMenu.style.display = 'none'
});


calendarBlock.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
});

calendarBlock.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].clientX;
  handleGesture();
});

function handleGesture() {
  const SWIPE_THRESHOLD = 150;
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
