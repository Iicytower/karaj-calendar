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
  data.forEach((day) => {
    const dayEl = document.createElement("div");
    dayEl.className = "calendar-day";
    dayEl.innerHTML = `
      <strong>${day.karajDate}</strong>
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

export function insertCalendar(calendarData) {
  const calendarBlock = document.querySelector('#calendarBlock');
  const calendarView = renderCalendar(calendarData);
  calendarBlock.innerHTML = '';
  calendarBlock.appendChild(calendarView);
}