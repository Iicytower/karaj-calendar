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
}