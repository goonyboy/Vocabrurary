import { setNavLinkActiveState } from './utils.js';
import { getRandomWords } from './api.js';

// Делаем вкладку "активной"
document.querySelectorAll('nav a').forEach(link => {
    setNavLinkActiveState([link]);
});

let wordsList = []; // Массив для хранения всех слов
let hasFlipped = false; // Флаг для отслеживания переворота

// Функция для создания карточки
function createCard(engWord, rusWord) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
        <div class="card-front">${engWord}</div>
        <div class="card-back">${rusWord}</div>
    `;
    
    card.addEventListener('click', () => {
        if (!hasFlipped) {
            card.classList.toggle('flipped');
            hasFlipped = true;
        } else {
            hasFlipped = false;
            showRandomWord(); // Показываем новое слово
        }
    });
    return card;
}

// Функция для показа случайного слова из загруженного списка
function showRandomWord() {
    if (wordsList.length === 0) {
        alert('Слова не найдены.');
        return;
    }

    const randomIndex = Math.floor(Math.random() * wordsList.length);
    const randomWord = wordsList[randomIndex];

    const cardContainer = document.getElementById('card-container');
    cardContainer.innerHTML = ''; // Очищаем контейнер
    const card = createCard(randomWord.eng_word, randomWord.rus_word);
    cardContainer.appendChild(card); // Добавляем новую карточку
}

// Функция для загрузки списка слов один раз при открытии страницы
async function loadWordsOnce() {
    try {
        wordsList = await getRandomWords(); // Загружаем список слов
        showRandomWord(); // Показываем первое случайное слово
    } catch (error) {
        console.error('Ошибка при загрузке слов:', error);
        alert('Не удалось загрузить слова.');
    }
}

// Инициализация при загрузке страницы
loadWordsOnce();