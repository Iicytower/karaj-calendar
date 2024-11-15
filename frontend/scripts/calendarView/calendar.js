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

  const dayNames = ["JECHKUŃ", "JECHBAŠKIUŃ", "ORTAKIUŃ", "CHANKIUŃ", "KIČIBARASKI", "BARASKI", "ŠABATKIUŃ"];
  // Render weekday headers
  dayNames.forEach((day) => {
    const header = document.createElement("div");
    header.textContent = day;
    header.className = "calendar-day weekday-header";
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

    dayEl.innerHTML = `
      <div class="dayNumber"><b>${Number(day.karajDate.split('-').at(2))}</b></div>
      ${day.gregDate}
    `;
    if (day.gregDate === today) {
      dayEl.classList.add("today");
    }
    if (day.holidays.length > 0) {
      dayEl.classList.add("holiday");
      day.holidays.forEach((holiday) => {
        const holidaySpan = document.createElement("span");
        holidaySpan.textContent = holiday;
        dayEl.appendChild(holidaySpan);
      });
    }
    calendarEl.appendChild(dayEl);
  });

  return calendarEl;
}

export function insertCalendar(calendarData, monthNameSelector) {
  const [year, month] = calendarData[10].karajDate.replace(/(\d{4})-(\d{2})-(\d{2})/, (match, year, month, day) => {
    
    return `${year},${month}`;
  }).split(',');

  const monthName = karajMonths.get(month);

  monthNameSelector.innerHTML = `${year} <i>${month}-${monthName}</i>`;

  const calendarBlock = document.querySelector('#calendarBlock');
  const calendarView = renderCalendar(calendarData);
  calendarBlock.innerHTML = '';
  calendarBlock.appendChild(calendarView);
}