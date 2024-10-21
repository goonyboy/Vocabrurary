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
    if (loading) return; // Предотвращает повторную загрузку
    loading = true; // Устанавливаем флаг загрузки

    getWords(currentPage)
        .then(response => {
            const newWords = response.data;

            // Фильтруем, чтобы не добавлять уже загруженные слова
            const filteredNewWords = newWords.filter(word =>
                !allLoadedWords.some(loadedWord => loadedWord.id === word.id)
            );

            if (filteredNewWords.length > 0) {
                allLoadedWords = [...allLoadedWords, ...filteredNewWords];

                // Очищаем и перерисовываем список слов
                wordsList.innerHTML = '';
                sortWords();
                renderWords(allLoadedWords, wordsList, deleteWord);

                currentPage++; // Увеличиваем номер страницы для следующего запроса
            } else {
                // Больше нет слов для подгрузки
                window.removeEventListener('scroll', loadMoreWords); // Отключаем скролл
            }

            loading = false; // Сбрасываем флаг после завершения
        })
        .catch(error => {
            console.error('Error fetching words:', error);
            loading = false; // Сбрасываем флаг даже при ошибке
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
            // Удаляем слово из массива
            allLoadedWords = allLoadedWords.filter(word => word.id !== wordId);
            
            // Очищаем контейнер перед рендерингом
            wordsList.innerHTML = '';
            
            // Сортируем и рендерим обновленный список
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

// Добавляем обработчик скролла
let scrollTimeout; // Переменная для хранения таймера

window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout); // Очищаем предыдущий таймер
    }

    scrollTimeout = setTimeout(() => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100 && !loading) {
            loadMoreWords();
        }
    }, 100); // Задержка в 100 миллисекунд
});

// Начальная загрузка слов
document.addEventListener("DOMContentLoaded", loadMoreWords);
