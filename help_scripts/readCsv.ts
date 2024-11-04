import { readFileSync } from "fs";

export function readCsv(filepath = './help_scripts/KOKIZOV2.csv') {
  const file = readFileSync(filepath, 'utf8');

  const plainData = file.split('\n').map(item => item.split(","));

  const [headers] = plainData.splice(0, 1);

  if(plainData[plainData.length - 1].length <= 1) {
    plainData.pop();
  }

  const final = plainData.reduce((acc: any[], item: string[]) => {
    const obj: Record<string, string> = {};
    for (let i = 0; i < 44; i++) {
      obj[`${headers[i]}`] = item[i];
    }

    acc.push(obj);

    return acc;
  }, []);

  return final;
}
