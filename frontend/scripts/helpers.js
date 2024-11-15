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

function getSliceOfObjectByIndexes(obj, startIndex, endIndex) {
  const keys = Object.keys(obj);
  
  const objectSlice = {};
  for (let i = startIndex; i <= endIndex; i++) {
    const key = keys[i];
    objectSlice[key] = obj[key];

  }
  
  return objectSlice;
}

export function getSliceOfObjectByKeys(obj, { startKey, minusCount = 0 }, { endKey, plusCount = 0 }) {
  const keys = Object.keys(obj);
  const startIndex = keys.indexOf(startKey) - minusCount;
  const endIndex = keys.indexOf(endKey) + plusCount;

  return getSliceOfObjectByIndexes(obj, startIndex, endIndex);
}

export function getCountOfPreviousRecordsInObject(obj, endKey, count) {
  const keys = Object.keys(obj);
  const endIndex = keys.indexOf(endKey);
  const startIndex = endIndex - count;

  return getSliceOfObjectByIndexes(obj, startIndex, endIndex);
}

export function getCountOfNextRecordsInObject(obj, startKey, count) {
  const keys = Object.keys(obj);
  const startIndex = keys.indexOf(startKey);
  const endIndex = startIndex + count;
  
  return getSliceOfObjectByIndexes(obj, startIndex, endIndex);

}

export function getFirstDayOfMonth(date) {
  return date.replace(/(\d{2})$/, '01');
}