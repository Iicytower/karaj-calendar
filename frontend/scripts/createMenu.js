import { getCurrentLanguage, readJSONFile } from "./helpers.js";
import { showPopup } from './popup.js';

export async function createMenu(closestHolidays) {
  const aboutHolidays = await readJSONFile('../data/menuItems.json');

  const language = getCurrentLanguage();

  const menu = document.createElement('div');

  for (const [key, value] of Object.entries(aboutHolidays)) {
    const holidayTitle = (!value[language].doesItArticle) ?
    value[language].name != value.kar.name ? value.kar.name + ' | ' + value[language].name : value[language].name :
    value[language].name;    

    const menuItem = document.createElement('div');
    menuItem.innerText = holidayTitle;
    /**
     * TODO
     * when I will have full data about holidays removo above line and uncommenr following line
     */
    // menuItem.innerText = value[language].name;

    menuItem.classList.add('menuItem');
    menuItem.id = key;

    menuItem.addEventListener('click', () => {
      const popup = showPopup();

      const description = value[language].description
        .replace('<<KarajDate>>', closestHolidays[key]?.karajDate)
        .replace('<<GregDate>>', closestHolidays[key]?.gregDate);

      let articleHTML = `
      <p class="holidayTitle">${holidayTitle}</p>
      `;

      if (!value[language].doesItArticle) {
        articleHTML = articleHTML + `<p>${value[language].closestDate}: <b>${closestHolidays[key].karajDate} | ${closestHolidays[key].gregDate}</b></p>`;
      }

      articleHTML = articleHTML + `<p>${description}</p>`;

      const sourcesHTML = (!value[language].doesItArticle) ? value[language].sources.map(item => `<p class="articleSource">${item}</p>`).join('') : '';

      popup.querySelector('article').innerHTML = articleHTML + sourcesHTML;
    });

    menu.appendChild(menuItem);
  }

  return menu;
}