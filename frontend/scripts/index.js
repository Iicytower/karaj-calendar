import { Calendar } from './calendarData/calendar.js';
import { insertCalendar } from './calendarView/calendar.js';
import { getFirstDayOfMonth, verifyDate } from './helpers.js';

const gregToKarajBtn = document.querySelector('#gregToKarajBtn');
const karajToGregBtn = document.querySelector('#karajToGregBtn');
const nextMonthBtn = document.querySelector("#nextMonth");
const previousMonthBtn = document.querySelector("#previousMonth");
const goToDate = document.querySelector('#goToDate');
const monthName = document.querySelector('#monthName');

const gregToKarajInput = document.querySelector("#gregToKarajInput");
const karajToGregInput = document.querySelector("#karajToGregInput");

let calendarDb;
let currentMonthInView;
window.onload = async () => {
  calendarDb = await Calendar.init();

  const currentMonthCalendarData = calendarDb.getMonthWithFullWeeks(new Date());

  insertCalendar(currentMonthCalendarData, monthName);

  currentMonthInView = getFirstDayOfMonth(currentMonthCalendarData[9].karajDate);
}

goToDate.addEventListener('keydown', (event) => {
  if(event.key != 'Enter') {
    return;
  }

  const calendarData = calendarDb.getMonthWithFullWeeks(goToDate.value);
  insertCalendar(calendarData, monthName);
  currentMonthInView = getFirstDayOfMonth(calendarData[9].karajDate);
});

previousMonthBtn.addEventListener('click', () => {
  const firstDayOfPreviousMonth = calendarDb.getFirstDayOfPreviousMonth(currentMonthInView);

  const calendarData = calendarDb.getMonthWithFullWeeks(calendarDb.getGregDate(firstDayOfPreviousMonth));
  insertCalendar(calendarData, monthName);
  currentMonthInView = getFirstDayOfMonth(calendarData[9].karajDate);
});

nextMonthBtn.addEventListener('click', () => {
  const firstDayOfNextMonth = calendarDb.getFirstDayOfNextMonth(currentMonthInView);

  const calendarData = calendarDb.getMonthWithFullWeeks(calendarDb.getGregDate(firstDayOfNextMonth));
  insertCalendar(calendarData, monthName);
  currentMonthInView = getFirstDayOfMonth(calendarData[9].karajDate);
});

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

gregToKarajBtn.addEventListener('click', gregToKarajCallback);
gregToKarajInput.addEventListener('keydown', gregToKarajCallback);
karajToGregBtn.addEventListener('click', karajToGregCallback);
karajToGregInput.addEventListener('keydown', karajToGregCallback);
