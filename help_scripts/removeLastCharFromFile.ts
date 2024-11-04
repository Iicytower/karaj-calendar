import { readFileSync, writeFileSync } from 'fs';

export function removeLastCharsFromFile(filePath: string, count = 2) {
  const data = readFileSync(filePath, 'utf8');
  const modifiedData = data.slice(0, -1 * count);

  writeFileSync(filePath, modifiedData, 'utf8');
}
