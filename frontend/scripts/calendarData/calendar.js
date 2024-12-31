import {
  getCountOfNextRecordsInObject,
  getCountOfPreviousRecordsInObject,
  getSliceOfObjectByKeys,
  parseDateTotring,
  replaceDiacriticalMarks,
} from '../helpers.js';
import { readData } from './readData.js';

export class Calendar {
  _gregToKaraj;
  _karajToGreg;
  _karajDetails;

  static async init() {
    const _this = new Calendar();
    const { gregToKaraj, karajDetails, karajToGreg } = await readData();

    _this._gregToKaraj = gregToKaraj;
    _this._karajToGreg = karajToGreg;
    _this._karajDetails = karajDetails;

    return _this;
  }

  getKarajDate(input) {
    if(input instanceof Date){
      input = parseDateTotring(input);
    }
    const result = this._gregToKaraj[input];

    if(!result) throw new Error('wrong date');

    return result;
  }

  getGregDate(input) {
    const result = this._karajToGreg[input];

    if(!result) throw new Error('wrong date');

    return result;
  }

  getMonthWithFullWeeks(date = new Date()) {
    if (date instanceof Date) {
      date = parseDateTotring(date);
    }

    const karajDate = this.getKarajDate(date);

    const { firstDayOfKarajMonth, lastDayOfKarajMonth } = this._getFirstAndLastDayOfKarajMonth(karajDate);

    const weekDayOfFirstDayOfMonth = this._karajDetails[firstDayOfKarajMonth].weekDay;
    const weekDayOfLastDayOfMonth = this._karajDetails[lastDayOfKarajMonth].weekDay;

    const month = getSliceOfObjectByKeys(
      this._karajDetails,
      { startKey: firstDayOfKarajMonth, minusCount: weekDayOfFirstDayOfMonth - 1 },
      { endKey: lastDayOfKarajMonth, plusCount: 7 - weekDayOfLastDayOfMonth }
    );

    return Object.entries(month).reduce((acc, [karajDate, karajDateData]) => {
      acc.push({...karajDateData, karajDate, gregDate: this._karajToGreg[karajDate]});
      return acc;
    }, []);
  }

  getFirstDayOfPreviousMonth(date) {
    const { firstDayOfKarajMonth } = this._getFirstAndLastDayOfKarajMonth(date);

    const [lastDayOfPreviousMonth] = Object.keys(getCountOfPreviousRecordsInObject(this._karajDetails, firstDayOfKarajMonth, 1));

    const { firstDayOfKarajMonth: firstDayOfPreviousMonth } = this._getFirstAndLastDayOfKarajMonth(lastDayOfPreviousMonth)

    return firstDayOfPreviousMonth;
  }

  getFirstDayOfNextMonth(date) {
    const { lastDayOfKarajMonth } = this._getFirstAndLastDayOfKarajMonth(date);

    const [,firstDayOfNextMonth] = Object.keys(getCountOfNextRecordsInObject(this._karajDetails, lastDayOfKarajMonth, 1));

    return firstDayOfNextMonth;
  }

  getClosestHolidays() {
    const karajToday = this.getKarajDate(new Date());
    const yearData = getCountOfNextRecordsInObject(this._karajDetails, karajToday, 384);

    const holidays = {};

    for (const [key, value] of Object.entries(yearData)) {
      if(value.holidays.length === 0) continue;

      for (const holiday of value.holidays) {
        const keyToStore = replaceDiacriticalMarks(holiday)
        if(holidays.hasOwnProperty(keyToStore)) continue;

        holidays[keyToStore] = { holiday, karajDate: key, gregDate: this.getGregDate(key) }
      }
    }

    return holidays;
  }

  _getFirstAndLastDayOfKarajMonth(date) {
    let firstDayOfKarajMonth = date.replace(/(\d{2})$/, '01');

    let lastDayOfKarajMonth = date.replace(/(\d{2})$/, '30');

    if(!this._karajDetails[lastDayOfKarajMonth]) {
      lastDayOfKarajMonth = lastDayOfKarajMonth.replace(/(\d{2})$/, '29')
    }

    return { firstDayOfKarajMonth, lastDayOfKarajMonth };
  }
}