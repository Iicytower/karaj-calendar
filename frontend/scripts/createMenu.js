import { getCurrentLanguage, readJSONFile } from "./helpers.js";
import { showPopup } from './popup.js';

export async function createMenu(closestHolidays) {
  const aboutHolidays = await readJSONFile('../data/menuItems.json');

  const language = getCurrentLanguage();

  const menu = document.createElement('div');

  for (const [key, value] of Object.entries(aboutHolidays)) {
    const menuItem = document.createElement('div');
    menuItem.innerText = key; 
    // menuItem.innerText = value[language].name;

    menuItem.classList.add('menuItem');
    menuItem.id = key;

    menuItem.addEventListener('click', () => {
      const popup = showPopup();

      popup.querySelector('article').innerHTML = `
      <p>${value.kar.name} - ${value[language].name}<p>
      <p>najbliże święto(greg): ${closestHolidays[key].gregDate}</p>
      <p>najbliże święto(karaj): ${closestHolidays[key].karajDate}</p>
      <p>${value[language].description}</p>
      `;
    });

    menu.appendChild(menuItem);
  }

  return menu;
}