import { appendFileSync, writeFileSync } from "fs";
import { readCsv } from "./readCsv";
import { removeLastCharsFromFile } from "./removeLastCharFromFile";

type CustomDate = {
  year: number;
  month: number;
  day: number;
};

type CountNumberOfDaysInPreviousMonthInput = {
  weekDayOfFirstDayOfCurrentMonth: number;
  weekDayOfFirstDayOfPreviousMonth: number;
}


type CountMonthDaysInput = {
  numberOfDaysInCurrentMonth: number,
  currentDay: Record<string, CustomDate>,
}

const resultFile = `${__dirname}/result.json`;

(async function(){
  const plainData = readCsv('./help_scripts/plain_kokizov.csv');

    const hebrToMonthNumber = new Map([
      ['Nisan', 'first'],
      ['Ijar', 'second'],
      ['Siwan', 'third'],
      ['Tammuz', 'fourth'],
      ['Aw', 'fiveth'],
      ['Elul', 'sixth'],
      ['Tiszri', 'seventh'],
      ['Cheszwan', 'eightth'],
      ['Kislew', 'nineth'],
      ['Tewet', 'tenth'],
      ['Szewat', 'eleventh'],
      ['Adar', 'twelveth'],
      ['Waadar', 'therteenth'],
    ]);

    const monthNumberToHebr = new Map([
      ['first', 'Nisan'],
      ['second', 'Ijar'],
      ['third', 'Siwan'],
      ['fourth', 'Tammuz'],
      ['fiveth', 'Aw'],
      ['sixth', 'ElulElul'],
      ['seventh', 'Tiszri'],
      ['eightth', 'Cheszwan'],
      ['nineth', 'Kislew'],
      ['tenth', 'Tewet'],
      ['eleventh', 'Szewat'],
      ['twelveth', 'Adar'],
      ['therteenth', 'Waadar'],
    ]);

  plainData.shift();

  const pieceOfData = plainData.splice(0, 48);

  let currentDay: Record<string, CustomDate> = {
    gregorian: {
      year: 1998,
      month: 9,
      day: 22,
    },
    karaj: {
      year: 5759,
      month: 7,
      day: 1,
    }
  };

  let weekDayOfFirstDayOfNextMonth = 3;

  writeFileSync(resultFile, `{\n`, 'utf8');

  for (const item of pieceOfData.reverse()) {
    let numberOfDaysInCurrentMonth: number;

    const monthsOrder = [
      'Elul',
      'Aw',
      'Tammuz',
      'Siwan',
      'Ijar',
      'Nisan',
      'Waadar',
      'Adar',
      'Szewat',
      'Tewet',
      'Kislew',
      'Cheszwan',
      'Tiszri',
    ];

    for (const monthName of monthsOrder) {
      if(monthName === 'Waadar' && !item.Waadar) {
        continue;
      }

      numberOfDaysInCurrentMonth = countNumberOfDaysInPreviousMonth({
        weekDayOfFirstDayOfCurrentMonth: weekDayOfFirstDayOfNextMonth,
        weekDayOfFirstDayOfPreviousMonth: Number(item[monthName]),
      });
  
      currentDay = decrementOneDay({
        currentDay,
        numberOfDaysInCurrentMonth,
        doesWaadarExists: !!item.Waadar,
      });
  
      weekDayOfFirstDayOfNextMonth = Number(item[monthName]);
  
      currentDay = countMonthDays({
        currentDay,
        numberOfDaysInCurrentMonth
      });
    }
  }
  removeLastCharsFromFile(resultFile);
  appendFileSync(resultFile, `\n}`, 'utf8');

})();

/**
 * pay attension to body of this function. 
 * it is not exact that the name suggest
 * it is decrement only in situation if input.currentDay is first day of karaj month.
 */
function decrementOneDay(input: {
  currentDay: Record<string, CustomDate>,
  numberOfDaysInCurrentMonth: number,
  doesWaadarExists: boolean;
}): Record<string, CustomDate> {
  const { currentDay, numberOfDaysInCurrentMonth, doesWaadarExists } = input;

  currentDay.karaj.day = numberOfDaysInCurrentMonth;
  if (currentDay.karaj.month === 1) {
    currentDay.karaj.month = doesWaadarExists ? 13 : 12;
  } else {
    currentDay.karaj.month = currentDay.karaj.month - 1;
  }
  currentDay.karaj.year = 
    currentDay.karaj.month === 6 ? 
    currentDay.karaj.year - 1 :
    currentDay.karaj.year;

  currentDay.gregorian = createCustomDate(
    addDaysToDate(
      new Date(createDateString(currentDay.gregorian)),
      -1
    )
  );

  return currentDay;
}

function countNumberOfDaysInPreviousMonth(input: CountNumberOfDaysInPreviousMonthInput) {
  const { weekDayOfFirstDayOfCurrentMonth, weekDayOfFirstDayOfPreviousMonth } = input;

  const dimmension = weekDayOfFirstDayOfCurrentMonth - weekDayOfFirstDayOfPreviousMonth;

  switch (dimmension) {
    case 1:
      return 29;
      break;
      
    case 2:
      return 30;
      break;
    
    case -6:
      return 29;
      break;

    case -5:
      return 30;
      break;

    default:
      throw new Error('Invalid input');
      break;
  }
}

function countMonthDays(input: CountMonthDaysInput) {
  const { numberOfDaysInCurrentMonth, currentDay} = input;

  let gregDate = '';
  let karajDate = '';
  
  for (let i = 0; i < numberOfDaysInCurrentMonth; i++) {
    gregDate = addDaysToDate(new Date(createDateString(currentDay.gregorian)), i * -1).toISOString().split('T')[0];
    
    karajDate = createDateString({
      year: currentDay.karaj.year,
      month: currentDay.karaj.month,
      day: currentDay.karaj.day - i,
    });
    
    appendFileSync(resultFile, `\t"${gregDate}": "${karajDate}",\n`, 'utf8');
  }

  currentDay.karaj.day = 1;
  currentDay.gregorian = createCustomDate(gregDate);

  return currentDay;
}

function addDaysToDate(date: Date, days: number) {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() + days);
  return newDate;
}

function createCustomDate(input: string | Date): CustomDate {
  if(input instanceof Date) input = input.toISOString().split('T')[0];

  const parts = input.split("-");
  
  if (parts.length !== 3) {
    throw new Error("Invalid date format. Expected format: yyyy-mm-dd");
  }
  
  const [year, month, day] = parts.map((part) => parseInt(part, 10));
  
  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    throw new Error("Invalid date components. Ensure the input contains valid numbers.");
  }
  
  return {
    year,
    month,
    day,
  };
}

function createDateString(date: CustomDate) {
  const { day, month, year } = date;

  return `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
}