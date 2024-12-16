import { readJSONFile } from "../helpers.js";

export async function readData() {  
  const gregToKaraj = await readJSONFile(`https://raw.githubusercontent.com/Iicytower/karaj-calendar/main/frontend/data/gregToKaraj.json`);
  const karajToGreg = await readJSONFile(`https://raw.githubusercontent.com/Iicytower/karaj-calendar/main/frontend/data/karajToGreg.json`);
  const karajDetails = await readJSONFile(`https://raw.githubusercontent.com/Iicytower/karaj-calendar/main/frontend/data/karajDetails.json`);

  // const gregToKaraj = await readJSONFile('../data/gregToKaraj.json');
  // const karajToGreg = await readJSONFile('../data/karajToGreg.json');
  // const karajDetails = await readJSONFile('../data/karajDetails.json');

  return { gregToKaraj, karajToGreg, karajDetails };
}