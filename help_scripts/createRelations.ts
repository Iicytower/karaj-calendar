import { appendFileSync, writeFileSync } from 'fs';
import { readCsv } from './readCsv';
import { removeLastCharsFromFile } from './removeLastCharFromFile';

type CustomDate = {
  year: number,
  month: number,
  day: number,
}

(async function(){
  const filePathGregToKaraj = `${__dirname}/gregToKaraj.json`;
  const filePathKarajToGreg = `${__dirname}/karajToGreg.json`;

  writeFileSync(filePathGregToKaraj, `{\n`, 'utf8');
  writeFileSync(filePathKarajToGreg, `{\n`, 'utf8');

  const plainData = readCsv();

  for (const row of plainData) {
    for (let i = 1; i <= 13; i++) {
      if(i === 13 && row.m13 === '0') continue;

      const karajDate: CustomDate = { 
        year: (i >= 7) ? row.year_b : row.year_b - 1,
        month: i,
        day: 1,
      };

      const currendGrerDateFromKokizov = new Date(new Date(new Date(row[`m${i}dat`]).getTime() + 1000 * 60 * 60 * 3).toISOString().split('T')[0]);
      
      const gregDate: CustomDate = { 
        year: currendGrerDateFromKokizov.getFullYear(),
        month: currendGrerDateFromKokizov.getMonth() + 1,
        day: currendGrerDateFromKokizov.getDate(),
      };
      
      for (let j = 0; j < Number(row[`m${i}dsk`]); j++) {
        const { gregToKarajRecord, karajToGregRecord } = createRecord({gregDate, karajDate});
        
        appendFileSync(filePathGregToKaraj, gregToKarajRecord);
        appendFileSync(filePathKarajToGreg, karajToGregRecord);

        karajDate.day++;

        const incrementedDate = addDay(new Date(`${gregDate.year}-${gregDate.month}-${gregDate.day}`));

        gregDate.year = incrementedDate.getFullYear();
        gregDate.month = incrementedDate.getMonth() + 1;
        gregDate.day = incrementedDate.getDate();
      } 
    }
  }
  removeLastCharsFromFile(filePathGregToKaraj);
  removeLastCharsFromFile(filePathKarajToGreg);
  appendFileSync(filePathGregToKaraj, "\n}");
  appendFileSync(filePathKarajToGreg, "\n}");
})()

function createDateString(date: CustomDate) {
  const { day, month, year } = date;
  
  return `${year}-${(month < 10) ? `0${month}` : month}-${(day < 10) ? `0${day}` : day}`;
}

function addDay(date: Date) {
  return new Date(new Date(date).setUTCDate(date.getUTCDate() + 1));
}

function createRecord(input: {gregDate: CustomDate, karajDate: CustomDate}) {
  const { gregDate, karajDate } = input;
  const gregToKarajRecord = `  "${createDateString(gregDate)}": "${createDateString(karajDate)}",\n`;
  const karajToGregRecord = `  "${createDateString(karajDate)}": "${createDateString(gregDate)}",\n`;
  
  return { gregToKarajRecord, karajToGregRecord };
}