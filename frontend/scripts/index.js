import { Calendar } from './calendar/calendar.js';
import { verifyDate } from './helpers.js';

let calendar;
window.onload = async () => {
  calendar = await Calendar.init();
}

const gregToKarajBtn = document.querySelector('#gregToKarajBtn');
const karajToGregBtn = document.querySelector('#karajToGregBtn');

gregToKarajBtn.addEventListener('click', () => {
  try{
    const gregToKarajInput = document.querySelector('#gregToKarajInput');
  
    const gregDate = gregToKarajInput.value;
  
    if (!verifyDate(gregDate)) throw new Error('wrong date');
  
    const karajDate = calendar.getKarajDate(gregDate)
    const answerField = document.querySelector("#translateBlock > div.translateDate.translateGregToKaraj > p")
    answerField.innerHTML = karajDate;
  } catch(error) {
    const answerField = document.querySelector("#translateBlock > div.translateDate.translateGregToKaraj > p")
    answerField.innerHTML = error.message;
  }
});

karajToGregBtn.addEventListener('click', () => {
  try{
    const karajToGregInput = document.querySelector('#karajToGregInput');
  
    const gregDate = karajToGregInput.value;
  
    if (!verifyDate(gregDate)) throw new Error('wrong date');
  
    const karajDate = calendar.getGregDate(gregDate)

    const answerField = document.querySelector("#translateBlock > div.translateDate.translateKarajToGreg > p")
    answerField.innerHTML = karajDate;
  } catch(error) {
    const answerField = document.querySelector("#translateBlock > div.translateDate.translateKarajToGreg > p")
    answerField.innerHTML = error.message;
  }
});