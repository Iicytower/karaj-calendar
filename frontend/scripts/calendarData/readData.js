async function readJSONFile(path) {
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

export async function readData() {
  const gregToKaraj = await readJSONFile('../data/gregToKaraj.json');
  const karajToGreg = await readJSONFile('../data/karajToGreg.json');
  const karajDetails = await readJSONFile('../data/karajDetails.json');

  return { gregToKaraj, karajToGreg, karajDetails };
}