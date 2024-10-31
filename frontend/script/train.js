import { setNavLinkActiveState } from './utils.js';
import { getRandomWords } from './api.js';

// Делаем вкладку "активной"
document.querySelectorAll('nav a').forEach(link => {
    setNavLinkActiveState([link]);
});


let hasFlipped = false; // Флаг для отслеживания переворота

// Функция для показа случайного слова из API
async function showRandomWord() {
    const cardFront = document.querySelector('.card-front');
    const cardBack = document.querySelector('.card-back');

    try {
        const randomWord = await getRandomWords();
        cardFront.textContent = randomWord.eng_word; // Устанавливаем английское слово
        cardBack.textContent = randomWord.rus_word; // Устанавливаем русский перевод
    } catch (error) {
        console.error('Ошибка при загрузке случайного слова:', error);
        alert('Не удалось загрузить слово.');
    }
}

// Инициализация при загрузке страницы
showRandomWord(); // Показываем первое случайное слово

// Обработчик клика по карточке
const card = document.querySelector('.card');
card.addEventListener('click', () => {
    if (!hasFlipped) {
        card.classList.toggle('flipped');
        hasFlipped = true;
    } else {
        card.classList.toggle('flipped'); // Переворачиваем обратно
        hasFlipped = false;
        showRandomWord(); // Загружаем новое слово
    }
});