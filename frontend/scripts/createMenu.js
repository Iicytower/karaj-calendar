import { createHolidayArticleTitle, getCurrentLanguage, readJSONFile } from "./helpers.js";
import { createPopupInnerHTML, showPopup } from './popup.js';

export async function createMenu(closestHolidays) {
  const aboutHolidays = await readJSONFile('https://raw.githubusercontent.com/Iicytower/karaj-calendar/main/frontend/data/menuItems.json');

  const language = getCurrentLanguage();

  const menu = document.createElement('div');

  for (const [key, value] of Object.entries(aboutHolidays)) {
    const holidayTitle = createHolidayArticleTitle({
      doesItArticle: value[language].doesItArticle,
      langName: value[language].name,
      karName: value.kar.name,
    });

    const menuItem = document.createElement('div');
    menuItem.innerText = holidayTitle;

    menuItem.classList.add('menuItem');
    menuItem.id = key;

    menuItem.addEventListener('click', () => {
      const popupContent = createPopupInnerHTML({
        doesItArticle: value[language].doesItArticle,
        descriptionTemplate: value[language].description,
        karHolidayName: value.kar.name,
        closestDate: value[language].closestDate,
        articleSources: value[language].sources,
        closestHolidays,
        holidayTitle,
      })

      menu.style.display = 'none';
      showPopup(popupContent);
    });

    menu.appendChild(menuItem);
  }

  return menu;
}
