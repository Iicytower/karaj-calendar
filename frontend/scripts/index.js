import { Calendar } from './calendarData/calendar.js';
import { insertCalendar } from './calendarView/calendar.js';
import { createGoToForm } from './createGoToForm.js';
// comment out due to next version
// import { createMenu } from './createMenu.js';
import {
  getCurrentLanguage,
  getCurrentMonthInView,
  getFirstDayOfMonth,
  setCurrentMonthInView,
} from './helpers.js';
import { hidePopup } from './popup.js';

let calendarDb;

window.onload = async () => {
  if (!getCurrentLanguage()) {
    localStorage.setItem('language', 'kar');
  }

  calendarDb = await Calendar.init();

  const currentMonthCalendarData = calendarDb.getMonthWithFullWeeks();

  await insertCalendar(currentMonthCalendarData, calendarDb.getClosestHolidays());

  setCurrentMonthInView(calendarDb, getFirstDayOfMonth(currentMonthCalendarData[9].karajDate));

  searchBar.appendChild(createGoToForm(calendarDb));
}

document.addEventListener("DOMContentLoaded", function () {
  const language = getCurrentLanguage();

  if (language === 'kar') {
    const languageKarBtn = document.querySelector('#languageKarBtn');
    languageKarBtn.style.backgroundColor = '#555';
    languageKarBtn.style.color = '#f1f1f1'
  }
  if (language === 'pl') {
    const languagePlBtn = document.querySelector('#languagePlBtn');
    languagePlBtn.style.backgroundColor = '#555';
    languagePlBtn.style.color = '#f1f1f1'
  }
  if (language === 'ru') {
    const languageRuBtn = document.querySelector('#languageRuBtn');
    languageRuBtn.style.backgroundColor = '#555';
    languageRuBtn.style.color = '#f1f1f1'
  }
  if (language === 'lt') {
    const languageLtBtn = document.querySelector('#languageLtBtn');
    languageLtBtn.style.backgroundColor = '#555';
    languageLtBtn.style.color = '#f1f1f1'
  }
  if (language === 'en') {
    const languageEnBtn = document.querySelector('#languageEnBtn');
    languageEnBtn.style.backgroundColor = '#555';
    languageEnBtn.style.color = '#f1f1f1'
  }
  
});

const nextMonthBtn = document.querySelector("#nextMonth");
const previousMonthBtn = document.querySelector("#previousMonth");
// comment out due to next version
// const menuBtn = document.querySelector('#menuBtn');
const calendarContainer = document.querySelector('#calendarContainer');
const searchBar = document.querySelector('.searchBar');

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

// comment out due to next version
// const menuBtnCallback = async () => {
//   const dropdownMenu = document.querySelector('.dropdown-menu');
//   dropdownMenu.style.display = 'block'
  
//   dropdownMenu.innerHTML = '';
  
//   const menu = await createMenu(calendarDb.getClosestHolidays());
  
//   dropdownMenu.appendChild(menu);
// };

previousMonthBtn.addEventListener('click', previousMonthCallback);
nextMonthBtn.addEventListener('click', nextMonthCallback);
// comment out due to next version
// menuBtn.addEventListener('click', menuBtnCallback);

// closing dropdown-menu on any outside click
document.addEventListener('click', (event) => {
  const dropdownMenu = document.querySelector('.dropdown-menu');
  if (dropdownMenu.contains(event.target) || menuBtn.contains(event.target)) return;

  dropdownMenu.style.display = 'none'
});

calendarContainer.addEventListener('click', () => {
  hidePopup();
  const dropdownMenu = document.querySelector('.dropdown-menu');
  dropdownMenu.classList.remove('show');
})