export function verifyDate(date) {
  return /\d{4}-\d{2}-\d{2}/gm.test(date);
}

export function incrementDayInDateString(date) {
  const newDate = date.replace(/(\d{4})-(\d{2})-(\d{2})/, (match, year, month, day) => {
    const incrementedDay = String(parseInt(day, 10) + 1).padStart(2, '0');
    return `${year}-${month}-${incrementedDay}`;
  });

  return newDate;
}

export function getSliceOfObject(obj, { startKey, minusCount = 0 }, { endKey, plusCount = 0 }) {
  const keys = Object.keys(obj);
  const startIndex = keys.indexOf(startKey) - minusCount;
  const endIndex = keys.indexOf(endKey) + plusCount;
  
  const objectSlice = {};
  for (let i = startIndex; i <= endIndex; i++) {
    const key = keys[i];
    objectSlice[key] = obj[key];

  }
  
  return objectSlice;
}