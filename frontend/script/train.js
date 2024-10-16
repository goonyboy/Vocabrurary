import { setNavLinkActiveState } from './utils.js'
//Делаем вкладку "активной"
document.querySelectorAll('nav a').forEach(link => {
    setNavLinkActiveState([link]);  // Передаем массив с одной ссылкой
});