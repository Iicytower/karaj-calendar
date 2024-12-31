import { Calendar } from './calendarData/calendar.js';
import { insertCalendar } from './calendarView/calendar.js';
import { createGoToForm } from './createGoToForm.js';
import { createMenu } from './createMenu.js';
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
    localStorage.setItem('language', 'kar')
  }
  
  calendarDb = await Calendar.init();

  const currentMonthCalendarData = calendarDb.getMonthWithFullWeeks();

  await insertCalendar(currentMonthCalendarData, calendarDb.getClosestHolidays());

  setCurrentMonthInView(calendarDb, getFirstDayOfMonth(currentMonthCalendarData[9].karajDate));

  searchBar.appendChild(createGoToForm(calendarDb));
}

const nextMonthBtn = document.querySelector("#nextMonth");
const previousMonthBtn = document.querySelector("#previousMonth");
const menuBtn = document.querySelector('#menuBtn');
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

const menuBtnCallback = async () => {
  const dropdownMenu = document.querySelector('.dropdown-menu');
  dropdownMenu.style.display = 'block'
  
  dropdownMenu.innerHTML = '';
  
  const menu = await createMenu(calendarDb.getClosestHolidays());
  
  dropdownMenu.appendChild(menu);
};

previousMonthBtn.addEventListener('click', previousMonthCallback);
nextMonthBtn.addEventListener('click', nextMonthCallback);
menuBtn.addEventListener('click', menuBtnCallback);

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