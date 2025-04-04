import { createHolidayArticleTitle, getCurrentLanguage, parseDateTotring, readJSONFile } from '../helpers.js';
import { createPopupInnerHTML, showPopup } from '../popup.js';

const karajMonths = new Map([
  ['01', 'ARTARYCH-AJ'],
  ['02', 'KURAL-AJ'],
  ['03', 'BAŠKUSCHAN-AJ'],
  ['04', 'JAZ-AJ'],
  ['05', 'ULAH-AJ'],
  ['06', 'ČIRIK-AJ'],
  ['07', 'AJRYCHSY-AJ'],
  ['08', 'KIUŹ-AJ'],
  ['09', 'SOHUM-AJ'],
  ['10', 'KYŠ-AJ'],
  ['11', 'KARAKYŠ-AJ'],
  ['12', 'SIUVIUŃČ-AJ'],
  ['13', 'ARTYCH-AJ'],
]);

export async function renderCalendar(data, closestHolidays) {
  const calendarEl = document.createElement("div");
  calendarEl.className = "calendar";

  const dayNames = [
    { pl: 'NIEDZIELA', kar: 'JECHKIUŃ', lt: 'SEKMADIENIS', ru: 'ВОСКРЕСЕНЬЕ', en: 'SUNDAY' },
    { pl: 'PONIEDZIAŁEK', kar: 'JECHBAŠKIUŃ', lt: 'PIRMADIENIS', ru: 'ПОНЕДЕЛЬНИК', en: 'MONDAY' },
    { pl: 'WTOREK', kar: 'ORTAKIUŃ', lt: 'ANTRADIENIS', ru: 'ВТОРНИК', en: 'TUESDAY' },
    { pl: 'ŚRODA', kar: 'CHANKIUŃ', lt: 'TREČIADIENIS', ru: 'СРЕДА', en: 'WEDNESDAY' },
    { pl: 'CZWARTEK', kar: 'KIČIBARASKI', lt: 'KETVIRTADIENIS', ru: 'ЧЕТВЕРГ', en: 'THURSDAY' },
    { pl: 'PIĄTEK', kar: 'BARASKI', lt: 'PENKTADIENIS', ru: 'ПЯТНИЦА', en: 'FRIDAY' },
    { pl: 'SOBOTA', kar: 'ŠABBATKIUŃ', lt: 'ŠEŠTADIENIS', ru: 'СУББОТА', en: 'SATURDAY' }
  ];
  
  // Render weekday headers
  dayNames.forEach((day) => {
    const header = document.createElement("div");
    const karajWeekDay = document.createElement("div");
    const langWeekDay = document.createElement("div");
    
    karajWeekDay.textContent = day.kar;
    karajWeekDay.className = "calendar-day weekday-header";
    const currentLang = getCurrentLanguage();
    if(currentLang !== 'kar') {
      langWeekDay.textContent = day[currentLang];
      langWeekDay.className = "calendar-day weekday-header";
    }

    header.appendChild(karajWeekDay);
    header.appendChild(langWeekDay);

    calendarEl.appendChild(header);
  });

  // Add empty cells for alignment if the first day isn't Sunday
  const firstDayOffset = data[0].weekDay - 1;
  for (let i = 0; i < firstDayOffset; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.className = "calendar-day";
    calendarEl.appendChild(emptyCell);
  }

  // Render days
  const today = parseDateTotring(new Date()) // Get today's date
  const month = data[14].karajDate.replace(/(\d{4})-(\d{2})-(\d{2})/, (match, year, month, day) => {
    return month;
  });

  data.forEach((day) => {
    const dayEl = document.createElement("div");
    dayEl.className = "calendar-day";

    if (!new RegExp(`(\\d{4})-(${month})-(\\d{2})`).test(day.karajDate)) {
      dayEl.classList.add('notCurrentMonth')
    }

    dayEl.innerHTML = `<div class="dayNumber">${Number(day.karajDate.split('-').at(2))}</div>`;
    if (day.gregDate === today) {
      dayEl.classList.add("today");
    }
    if (day.weekDay === 7) {
      dayEl.classList.add("holiday");
      dayEl.classList.add("saturday");
    }
    if (day.holidays.length > 0) {
      if(day.holidays.at(0) === 'Haggada_Kiečiasi') {
        dayEl.classList.add("fw-bolder");
      } else {
        dayEl.classList.add("holiday");
      }

      day.holidays.forEach((holiday) => {
        const holidaySpan = document.createElement("span");
        holidaySpan.classList.add('holidayName');
        holidaySpan.setAttribute('data-holidayName', holiday);
        holidaySpan.textContent = holiday.replaceAll('_', ' ');

        dayEl.appendChild(holidaySpan);
      });
    }
    const gregDate = document.createElement('span');
    gregDate.classList.add('gregDate');
    gregDate.textContent = day.gregDate;
    dayEl.appendChild(gregDate)
    calendarEl.appendChild(dayEl);
  });

  return calendarEl;
}

export async function insertCalendar(calendarData, closestHolidays) {
  const monthNameSelector = document.querySelector('#monthName');
  const yearSelector = document.querySelector('#year');

  const [year, month] = calendarData[10].karajDate.replace(/(\d{4})-(\d{2})-(\d{2})/, (match, year, month, day) => {
    
    return `${year},${month}`;
  }).split(',');

  const monthName = karajMonths.get(month);

  monthNameSelector.innerHTML = `${monthName} (${month})`;
  yearSelector.innerHTML = String(year);

  const calendarBlock = document.querySelector('#calendarBlock');
  const calendarView = await renderCalendar(calendarData, closestHolidays);
  calendarBlock.innerHTML = '';
  calendarBlock.appendChild(calendarView);
}