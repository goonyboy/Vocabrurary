import { setNavLinkActiveState } from './utils.js';
import { getWords, deleteWordFromServer } from './api.js';
import { renderWords } from './utils.js';

document.querySelectorAll('nav a').forEach(link => {
    setNavLinkActiveState([link]);
});

let currentPage = 1;
const wordsPerPage = 10;
let totalWords = 0;
let totalPages = 1;
let currentFilter = '';

const wordsList = document.getElementById("words-list");
const searchInput = document.getElementById("search-input");
const paginationContainer = document.getElementById("pagination");

// Функция загрузки слов с сервера
function loadWords(page = 1, wordFilter = '') {
    getWords(page, wordsPerPage, wordFilter)
        .then(response => {
            const { items, total, pages } = response.data;

            totalWords = total;
            totalPages = pages;

            renderPage(items);
            createPagination();
        })
        .catch(error => {
            console.error('Error fetching words:', error);
        });
}

// Функция отображения слов на текущей странице
function renderPage(words) {
    wordsList.innerHTML = '';
    renderWords(words, wordsList, deleteWord);
}

// Функция для удаления слова
function deleteWord(wordId) {
    deleteWordFromServer(wordId)
        .then(() => {
            loadWords(currentPage, currentFilter);
        })
        .catch(error => {
            console.error('Error deleting word:', error);
        });
}

// Функция создания пагинации
function createPagination() {
    paginationContainer.innerHTML = '';

    const createButton = (page, label = page) => {
        const button = document.createElement('button');
        button.className = 'pagination-button';
        button.textContent = label;
        if (page === currentPage) button.classList.add('active');

        button.addEventListener('click', () => {
            currentPage = page;
            loadWords(currentPage, currentFilter);
        });

        paginationContainer.appendChild(button);
    };

    if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) {
            createButton(i);
        }
    } else {
        createButton(1);
        if (currentPage > 3) paginationContainer.appendChild(document.createTextNode('...'));

        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            createButton(i);
        }

        if (currentPage < totalPages - 2) paginationContainer.appendChild(document.createTextNode('...'));
        createButton(totalPages);
    }
}

// Функция для фильтрации слов
function filterWords(query) {
    currentPage = 1;
    currentFilter = query;
    loadWords(currentPage, currentFilter);
}

// Обработчик для поиска
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    filterWords(query);
});

// Начальная загрузка слов
document.addEventListener("DOMContentLoaded", () => loadWords(currentPage));
