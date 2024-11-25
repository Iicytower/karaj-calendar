import { appendFileSync, readFileSync, writeFileSync } from 'fs';
import { removeLastCharsFromFile } from './removeLastCharFromFile';

type FinalDayData = {
  weekDay: number;
  holidays: string[];
};

type CustomDate = {
  year: number;
  month: number;
  day: number;
  weekDay: number;
};
let daysFromSanBaszy = -1;

(async function () {
  const karajToGreg = JSON.parse(readFileSync(`${__dirname}/karajToGreg.json`, 'utf8'));
  let currentWeekDay = 1;

  const filePath = `${__dirname}/karajDetails.json`;

  writeFileSync(filePath, `{\n`, 'utf8');

  for (const karaj of Object.keys(karajToGreg)) {
    currentWeekDay = incrementWeekDay(currentWeekDay);
    if (daysFromSanBaszy !== -1) daysFromSanBaszy = daysFromSanBaszy + 1;

    const karajDate: CustomDate = {
      year: Number(karaj.split('-')[0]),
      month: Number(karaj.split('-')[1]),
      day: Number(karaj.split('-')[2]),
      weekDay: currentWeekDay,
    };

    const data: FinalDayData = {
      weekDay: currentWeekDay,
      holidays: [],
    };

    const holidays = checkHolidays(karajDate, currentWeekDay);

    data.holidays = holidays;

    appendFileSync(filePath, `  "${karaj}": ${JSON.stringify(data)},\n`);
  }

  removeLastCharsFromFile(filePath);
  appendFileSync(filePath, '\n}');
})();

function incrementWeekDay(day: number): number {
  return day === 7 ? 1 : day + 1;
}

function checkHolidays(karajDate: CustomDate, currentWeekDay: number) {
  const holidays = [];

  if (karajDate.day === 1) {
    holidays.push('Janhyj');
  }

  if (karajDate.month === 1 && karajDate.day === 1) {
    holidays.push('Jyl_Bašy');
  }

  if (karajDate.month === 1 && karajDate.day === 14) {
    holidays.push('Haggada');
  }

  if (karajDate.month === 1 && karajDate.day >= 15 && karajDate.day <= 21) {

    holidays.push('Tymbyl_Chydžy');

    if (currentWeekDay === 1) {
      holidays.push('San_Bašy');
      daysFromSanBaszy = 0;
    }
  }

  if (daysFromSanBaszy === 24) {
    holidays.push('Jarty_San');
  }

  if (daysFromSanBaszy === 49) {
    holidays.push('Aftalar_Chydžy');
    daysFromSanBaszy = -1;
  }

  if (
    (karajDate.month === 4 && karajDate.day === 9 && currentWeekDay != 7) ||
    (karajDate.month === 4 && karajDate.day === 10 && currentWeekDay === 1) // holiday moving to sunday
  ) {
    holidays.push('Burunhu_Oruč');
  }

  if (
    (karajDate.month === 5 && karajDate.day >= 1 && karajDate.day <= 6) ||
    (karajDate.month === 5 && karajDate.day === 7 && currentWeekDay === 7)
  ) {
    holidays.push('On_Kiuń-ara');
  }

  if(
    (karajDate.month === 5 && karajDate.day === 7 && currentWeekDay != 7) ||
    (karajDate.month === 5 && karajDate.day === 8 && currentWeekDay === 1)
  ){
    holidays.push('Ortančy_Oruč');
  }

  if (
    (karajDate.month === 5 && karajDate.day === 7 && currentWeekDay != 7) ||
    (karajDate.month === 5 && karajDate.day === 8) ||
    (karajDate.month === 5 && karajDate.day === 9 && currentWeekDay != 6)
  ) {
    holidays.push('Üč_Kiuń-ara');
  }

  if (
    (karajDate.month === 5 && karajDate.day === 9 && currentWeekDay === 6) ||
    (karajDate.month === 5 && karajDate.day === 10 && currentWeekDay != 7)
  ) {
    holidays.push('Kurban'); // holiday moving to friday
  }

  if (karajDate.month === 7 && karajDate.day === 1) {
    holidays.push('Byrhy_Kiuniu');
  }

  if (karajDate.month === 7 && karajDate.day === 10) {
    holidays.push('Bošatlych');
  }

  if (karajDate.month === 7 && karajDate.day >= 15 && karajDate.day <= 22) {
    holidays.push('Alačych_Chydžy');
  }

  if (
    (karajDate.month === 7 && karajDate.day === 24 && currentWeekDay != 7) ||
    (karajDate.month === 7 && karajDate.day === 25 && currentWeekDay === 1)
  ) {
    holidays.push('Kičiriak_Oruč');
  }

  if (
    (karajDate.month === 10 && karajDate.day === 10 && currentWeekDay != 7) ||
    (karajDate.month === 10 && karajDate.day === 11 && currentWeekDay === 1)
  ) {
    holidays.push('Oruč');
  }

  if (karajDate.month === 12 && karajDate.day === 14) {
    holidays.push('Kynyš');
  }

  return holidays;
}
