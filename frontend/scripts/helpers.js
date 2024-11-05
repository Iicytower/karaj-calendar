export function verifyDate(date) {
  return /\d{4}-\d{2}-\d{2}/gm.test(date);
}