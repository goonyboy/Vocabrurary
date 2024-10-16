import { setNavLinkActiveState } from './utils.js'

document.querySelectorAll('nav a').forEach(link => {
    setNavLinkActiveState([link]);  // Передаем массив с одной ссылкой
});