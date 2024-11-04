import { appendFileSync, readFileSync, writeFileSync } from 'fs';
import { removeLastCharsFromFile } from './removeLastCharFromFile';

type FinalDayData = {
  weekDay: number,
  holidays: string[],
}

type CustomDate = {
  year: number,
  month: number,
  day: number,
  weekDay: number,
}
let daysFromSanBaszy = -1;

(async function(){
  const karajToGreg = JSON.parse(readFileSync(`${__dirname}/karajToGreg.json`, 'utf8'));
  let currentWeekDay = 3;

  const filePath = `${__dirname}/karajDetails.json`;
  
  writeFileSync(filePath, `{\n`, 'utf8');


  for (const karaj of Object.keys(karajToGreg)) {
    currentWeekDay = incrementWeekDay(currentWeekDay);
    if(daysFromSanBaszy !== -1) daysFromSanBaszy = daysFromSanBaszy + 1;

    const karajDate: CustomDate = {
      year: Number(karaj.split('-')[0]),
      month: Number(karaj.split('-')[1]),
      day: Number(karaj.split('-')[2]),
      weekDay: currentWeekDay,
    }

    const data: FinalDayData = {
      weekDay: currentWeekDay,
      holidays: [],
    };

    const holidays = checkHolidays(karajDate, currentWeekDay);

    data.holidays = holidays;

    appendFileSync(filePath, `  "${karaj}": ${JSON.stringify(data)},\n`);
  }
  removeLastCharsFromFile(filePath);
  appendFileSync(filePath, "\n}");
})()

function incrementWeekDay(day: number): number {
  return (day === 7) ? 1 : day + 1;
}

function checkHolidays(karajDate: CustomDate, currentWeekDay: number) {
  const holidays = [];

  if(karajDate.day === 1) { // Janhyj
    holidays.push('Janhyj');
  }

  if(karajDate.month === 1 && karajDate.day === 1) { // Jył_Baszy
    holidays.push('Jył_Baszy');
  }

  if(karajDate.month === 1 && karajDate.day === 14) { // Haggada
    holidays.push('Haggada');
  }
  
  if(karajDate.month === 1 && karajDate.day >= 15 && karajDate.day <= 21) { // Tymbyl_Chydży
    holidays.push('Tymbyl_Chydży');

    if(currentWeekDay === 1) {  // San_Baszy
      holidays.push('San_Baszy')
      daysFromSanBaszy = 0;
    }
  }
  
  if(daysFromSanBaszy === 24) { // Jarty_San
    holidays.push('Jarty_San');
  }

  if(daysFromSanBaszy === 49) { // Aftalar_Chydży
    holidays.push('Aftalar_Chydży');
    daysFromSanBaszy = -1;
  }

  if(karajDate.month === 4 && karajDate.day === 9 && currentWeekDay != 7) { // Burunhu_Orucz
    holidays.push('Burunhu_Orucz');
  }

  if(karajDate.month === 4 && karajDate.day === 10 && currentWeekDay === 1) { // Burunhu_Orucz
    holidays.push('Burunhu_Orucz'); // holiday moving to sunday
  }

  if(karajDate.month === 5 && karajDate.day >= 1 && karajDate.day <= 6 ) { // On_Kiun-ara
    holidays.push('On_Kiun-ara');
  }

  if(karajDate.month === 5 && karajDate.day === 7 && currentWeekDay != 7 ) { // Ortanczy_Orucz_Ucz-Kiun-ara
    holidays.push('Ortanczy_Orucz_Ucz-Kiun-ara');
  }

  if(karajDate.month === 5 && karajDate.day >= 8 && karajDate.day <= 9 ) { // Ortanczy_Orucz_Ucz-Kiun-ara
    holidays.push('Ortanczy_Orucz_Ucz-Kiun-ara');
  }

  if(karajDate.month === 5 && karajDate.day === 9 && currentWeekDay === 6) { // Kurban
    holidays.pop(); // remove last item from array
    holidays.push('Kurban'); // holiday moving to friday
  }
  
  if(karajDate.month === 5 && karajDate.day === 10 && currentWeekDay != 7) { // Kurban
    holidays.push('Kurban');
  }

  if(karajDate.month === 7 && karajDate.day === 1) { // Byrhy_Kiuniu
    holidays.push('Byrhy_Kiuniu');
  }

  if(karajDate.month === 7 && karajDate.day === 10) { // Boszatlych
    holidays.push('Boszatlych');
  }
  
  if(karajDate.month === 7 && karajDate.day >= 15 && karajDate.day <= 22 ) { // Alaczych_Chydży
    holidays.push('Alaczych_Chydży');
  }

  if(karajDate.month === 7 && karajDate.day === 24 && currentWeekDay != 7) { // Kiczirak_Orucz
    holidays.push('Kiczirak_Orucz');
  }

  if(karajDate.month === 7 && karajDate.day === 24 && currentWeekDay === 6) { // Kiczirak_Orucz
    holidays.push('Kiczirak_Orucz'); // holiday moving to sunday
  }

  if(karajDate.month === 10 && karajDate.day === 10 && currentWeekDay != 7) { // Orucz
    holidays.push('Orucz');
  }

  if(karajDate.month === 10 && karajDate.day === 10 && currentWeekDay === 6) { // Orucz
    holidays.push('Orucz');  // holiday moving to sunday
  }

  if(karajDate.month === 12 && karajDate.day === 14) { // Kynysz
    holidays.push('Kynysz');
  }

  return holidays;
}