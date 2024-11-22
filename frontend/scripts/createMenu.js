import { readJSONFile } from "./helpers.js";
import { showPopup } from './popup.js';

export async function createMenu() {
  const aboutHolidays = await readJSONFile('../data/menuItems.json');

  const language = localStorage.getItem('language');

  const menu = document.createElement('div');

  for (const [key, value] of Object.entries(aboutHolidays)) {
    const menuItem = document.createElement('div');
    menuItem.innerText = key; 
    // menuItem.innerText = value[language].name;

    menuItem.classList.add('menuItem');
    menuItem.id = key;

    menuItem.addEventListener('click', () => {
      const popup = showPopup();

      popup.querySelector('article').innerHTML = `<p>${value[language].description}</p>`;
    });

    menu.appendChild(menuItem);
  }

  return menu;
}