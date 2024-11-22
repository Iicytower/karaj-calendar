import { readJSONFile } from "../helpers.js";

export async function readData() {
  const gregToKaraj = await readJSONFile('../data/gregToKaraj.json');
  const karajToGreg = await readJSONFile('../data/karajToGreg.json');
  const karajDetails = await readJSONFile('../data/karajDetails.json');

  return { gregToKaraj, karajToGreg, karajDetails };
}