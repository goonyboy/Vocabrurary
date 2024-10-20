import { setNavLinkActiveState } from './utils.js'

document.querySelectorAll('nav a').forEach(link => {
    setNavLinkActiveState([link]);  // Передаем массив с одной ссылкой
});

import { getWords, deleteWordFromServer } from './api.js';
import { renderWords } from './utils.js';

let currentPage = 1;  // Номер текущей страницы
let loading = false;  // Флаг загрузки
let allLoadedWords = [];  // Массив для хранения всех загруженных слов
let filteredWords = [];   // Массив для хранения отфильтрованных слов
const wordsList = document.getElementById("words-list");
const searchInput = document.getElementById("search-input");

// Функция для загрузки слов с сервера
function loadMoreWords() {
    if (loading) return;
    loading = true;

    getWords(currentPage)
        .then(response => {
            const newWords = response.data;

            // Фильтруем, чтобы не добавлять уже загруженные слова
            const filteredNewWords = newWords.filter(word =>
                !allLoadedWords.some(loadedWord => loadedWord.id === word.id)
            );

            if (filteredNewWords.length > 0) {
                allLoadedWords = [...allLoadedWords, ...filteredNewWords];

                // Сортируем и отображаем
                sortWords();
                renderWords(allLoadedWords, wordsList, deleteWord);
            }

            currentPage++;
            loading = false;
        })
        .catch(error => {
            console.error('Error fetching words:', error);
            loading = false;
        });
}

// Функция для сортировки слов
function sortWords() {
    allLoadedWords.sort((a, b) => a.eng_word.localeCompare(b.eng_word));
}

// Функция для удаления слова
function deleteWord(wordId) {
    deleteWordFromServer(wordId)
        .then(() => {
            allLoadedWords = allLoadedWords.filter(word => word.id !== wordId);
            sortWords();
            renderWords(allLoadedWords, wordsList, deleteWord);
        })
        .catch(error => {
            console.error('Error deleting word:', error);
            alert('Не удалось удалить слово.');
        });
}

// Функция для фильтрации слов по поисковому запросу
function filterWords(query) {
    query = query.toLowerCase();
    filteredWords = allLoadedWords.filter(word => 
        word.eng_word.toLowerCase().includes(query) || 
        word.rus_word.toLowerCase().includes(query)
    );

    // Очищаем контейнер перед рендерингом
    wordsList.innerHTML = '';

    // Отображаем отфильтрованные слова
    renderWords(filteredWords, wordsList, deleteWord);
}

// Обработчик для поиска
searchInput.addEventListener('input', (e) => {
    const query = e.target.value;
    filterWords(query);
});

// Отслеживание прокрутки для подгрузки новых слов
window.addEventListener('scroll', () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 200 && !loading) {
        loadMoreWords();
    }
});

// Начальная загрузка слов
document.addEventListener("DOMContentLoaded", loadMoreWords);
