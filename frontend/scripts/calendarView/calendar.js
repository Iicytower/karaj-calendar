const karajMonths = new Map([
  ['01', 'ARTARYCH-AJ'],
  ['02', 'KURAL-AJ'],
  ['03', 'BAŠKUS-CHAN-AJ'],
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

export function renderCalendar(data) {
  const calendarEl = document.createElement("div");
  calendarEl.className = "calendar";

  const dayNames = [
    { pl: 'NIEDZIELA', kar: 'JECHKUŃ', lt: 'SEKMADIENIS', ru: 'ВОСКРЕСЕНЬЕ', en: 'SUNDAY' },
    { pl: 'PONIEDZIAŁEK', kar: 'JECHBAŠKIUŃ', lt: 'PIRMADIENIS', ru: 'ПОНЕДЕЛЬНИК', en: 'MONDAY' },
    { pl: 'WTOREK', kar: 'ORTAKIUŃ', lt: 'ANTRADIENIS', ru: 'ВТОРНИК', en: 'TUESDAY' },
    { pl: 'ŚRODA', kar: 'CHANKIUŃ', lt: 'TREČIADIENIS', ru: 'СРЕДА', en: 'WEDNESDAY' },
    { pl: 'CZWARTEK', kar: 'KIČIBARASKI', lt: 'KETVIRTADIENIS', ru: 'ЧЕТВЕРГ', en: 'THURSDAY' },
    { pl: 'PIĄTEK', kar: 'BARASKI', lt: 'PENKTADIENIS', ru: 'ПЯТНИЦА', en: 'FRIDAY' },
    { pl: 'SOBOTA', kar: 'ŠABBATKIUŃ', lt: 'ŠEŠTADIENIS', ru: 'СУББОТА', en: 'SATURDAY' }
]
  
  // Render weekday headers
  dayNames.forEach((day) => {
    const header = document.createElement("div");
    const karajWeekDay = document.createElement("div");
    const langWeekDay = document.createElement("div");
    
    karajWeekDay.textContent = day.kar;
    karajWeekDay.className = "calendar-day weekday-header";

    if(localStorage.getItem('language') !== 'kar') {
      langWeekDay.textContent = day[localStorage.getItem('language')];
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
  const today = new Date().toISOString().split("T")[0]; // Get today's date
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
    }
    if (day.holidays.length > 0) {
      dayEl.classList.add("holiday");
      day.holidays.forEach((holiday) => {
        const holidaySpan = document.createElement("span");
        holidaySpan.classList.add('holidayName');
        holidaySpan.textContent = holiday;
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

export function insertCalendar(calendarData, monthNameSelector, yearSelector) {
  const [year, month] = calendarData[10].karajDate.replace(/(\d{4})-(\d{2})-(\d{2})/, (match, year, month, day) => {
    
    return `${year},${month}`;
  }).split(',');

  const monthName = karajMonths.get(month);

  monthNameSelector.innerHTML = `${monthName} (${month})`;
  yearSelector.innerHTML = String(year);

  const calendarBlock = document.querySelector('#calendarBlock');
  const calendarView = renderCalendar(calendarData);
  calendarBlock.innerHTML = '';
  calendarBlock.appendChild(calendarView);
}