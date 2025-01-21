export async function readJSONFile(path) {
  let response;
  await fetch(path)
    .then(response => response.json())
    .then(data => {
      response = data
    })
    .catch(error => {
      console.error('Error reading JSON file:', error);
    });
  return response;
}

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

export function getCurrentLanguage() {
  return localStorage.getItem('language');
}

export function setCurrentMonthInView(calendarDb, date) {
  const gregDate = calendarDb.getGregDate(date);

  if (
    new Date(gregDate).getTime() < new Date('1997-04-09').getTime() ||
    new Date(gregDate).getTime() >= new Date('2101-03-30').getTime()
  ) {
    return false;
  }
  localStorage.setItem('currentMonthInView', date);
  return true;
}

export function getCurrentMonthInView(){
  return localStorage.getItem('currentMonthInView');
}

export function createHolidayArticleTitle(input) {
  const { doesItArticle, langName, karName } = input;

  return (!doesItArticle) ? // first condition
  (langName != karName) ? // if first condition is true do second condition
    `${karName} | ${langName}`: // if second condition is true do this
    langName : // if second condion is false do this
  langName; // if first condition is false do this,
}

export function parseDateTotring(date) {
  return date.toISOString().split('T')[0];
}

export function replaceDiacriticalMarks(input) {
  return `${input}`
    .replace('ž', 'z')
    .replace('Ž', 'Z')
    .replace('č', 'c')
    .replace('Č', 'c')
    .replace('Ü', 'U')
    .replace('ü', 'u')
    .replace('š', 's')
    .replace('Š', 'S')
    .replace('Ń', 'N')
    .replace('ń', 'n')
    .toLowerCase();
}