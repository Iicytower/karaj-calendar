import { getSliceOfObject } from '../helpers.js';
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
    const result = this._gregToKaraj[input];

    if(!result) throw new Error('wrong date');

    return result;
  }

  getGregDate(input) {
    const result = this._karajToGreg[input];

    if(!result) throw new Error('wrong date');

    return result;
  }

  getMonthWithFullWeeks(date) {
    if (!date) throw new Error('wrong date');

    if (date instanceof Date) {
      date = date.toISOString().split('T')[0];
    }

    const karajDate = this.getKarajDate(date);

    const { firstDayOfKarajMonth, lastDayOfKarajMonth } = this._getFirstAndLastDayOfKarajMonth(karajDate);

    const weekDayOfFirstDayOfMonth = this._karajDetails[firstDayOfKarajMonth].weekDay;
    const weekDayOfLastDayOfMonth = this._karajDetails[lastDayOfKarajMonth].weekDay;

    const month = getSliceOfObject(
      this._karajDetails,
      { startKey: firstDayOfKarajMonth, minusCount: weekDayOfFirstDayOfMonth - 1 },
      { endKey: lastDayOfKarajMonth, plusCount: 7 - weekDayOfLastDayOfMonth }
    );

    return Object.entries(month).reduce((acc, [karajDate, karajDateData]) => {
      acc.push({...karajDateData, karajDate, gregDate: this._karajToGreg[karajDate]});
      return acc;
    }, []);
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