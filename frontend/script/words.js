import { setNavLinkActiveState } from './utils.js';
import { getWords, deleteWordFromServer } from './api.js';
import { renderWords } from './utils.js';

document.querySelectorAll('nav a').forEach(link => {
    setNavLinkActiveState([link]);
});

let currentPage = 1;
const wordsPerPage = 10;
let loading = false;
let allLoadedWords = [];
let filteredWords = []; // Слова, соответствующие поисковому запросу
let totalWords = 0;
let totalPages = 1;

const wordsList = document.getElementById("words-list");
const searchInput = document.getElementById("search-input");
const paginationContainer = document.getElementById("pagination");

// Функция загрузки слов с сервера
function loadWords(page = 1) {
    if (loading) return;
    loading = true;

    getWords(page)
        .then(response => {
            const { items, total } = response.data;

            totalWords = total;
            totalPages = Math.ceil(totalWords / wordsPerPage);
            allLoadedWords = items;
            filteredWords = allLoadedWords;

            renderPage(currentPage);
            createPagination();
            loading = false;
        })
        .catch(error => {
            console.error('Error fetching words:', error);
            loading = false;
        });
}

// Функция отображения определенной страницы
function renderPage(page) {
    const start = (page - 1) * wordsPerPage;
    const wordsToDisplay = filteredWords.slice(start, start + wordsPerPage);

    wordsList.innerHTML = '';
    renderWords(wordsToDisplay, wordsList, deleteWord);
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
            renderPage(currentPage);
            createPagination();
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

// Функция фильтрации слов
function filterWords(query) {
    currentPage = 1;
    query = query.toLowerCase();
    filteredWords = allLoadedWords.filter(word =>
        word.eng_word.toLowerCase().includes(query) || 
        word.rus_word.toLowerCase().includes(query)
    );

    totalPages = Math.ceil(filteredWords.length / wordsPerPage);
    renderPage(currentPage);
    createPagination();
}

// Функция удаления слова
function deleteWord(wordId) {
    deleteWordFromServer(wordId)
        .then(() => {
            allLoadedWords = allLoadedWords.filter(word => word.id !== wordId);
            filterWords(searchInput.value); // Перезагрузка с учетом фильтрации
        })
        .catch(error => {
            console.error('Error deleting word:', error);
            alert('Не удалось удалить слово.');
        });
}

// Обработчик для поиска
searchInput.addEventListener('input', (e) => {
    const query = e.target.value;
    filterWords(query);
});

// Начальная загрузка слов
document.addEventListener("DOMContentLoaded", () => loadWords(currentPage));
