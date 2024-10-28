import { setNavLinkActiveState } from './utils.js';
import { getWords, deleteWordFromServer } from './api.js';
import { renderWords } from './utils.js';

document.querySelectorAll('nav a').forEach(link => {
    setNavLinkActiveState([link]);  // Передаем массив с одной ссылкой
});

const wordsList = document.getElementById("words-list");
const searchInput = document.getElementById("search-input");
const paginationContainer = document.getElementById("pagination");

let allWords = [];   // Массив для хранения всех слов из базы данных
let totalPages = 1;  // Общее количество страниц
let currentPage = 1; // Номер текущей страницы
const wordsPerPage = 1; // Количество слов на странице

// Функция для загрузки всех слов с сервера и расчета пагинации
function loadAllWords() {
    getWords(currentPage || 1) // Проверяем значение currentPage, чтобы оно всегда было определено
        .then(response => {
            allWords = response.data.items;
            totalPages = Math.ceil(response.data.total / wordsPerPage); // Вычисляем общее количество страниц
            renderPage(currentPage); // Рендерим первую страницу
            renderPagination(); // Рендерим кнопки пагинации
        })
        .catch(error => {
            console.error('Error fetching words:', error);
        });
}

// Функция для отображения слов на текущей странице
function renderPage(page) {
    const start = (page - 1) * wordsPerPage;
    const end = start + wordsPerPage;
    const wordsToShow = allWords.slice(start, end); // Берем слова для текущей страницы
    wordsList.innerHTML = ''; // Очищаем список перед рендером
    renderWords(wordsToShow, wordsList, deleteWord); // Отображаем слова
}

// Функция для рендеринга кнопок пагинации
function renderPagination() {
    paginationContainer.innerHTML = ''; // Очищаем контейнер пагинации

    const addPageButton = (page, text = page) => {
        const pageButton = document.createElement("button");
        pageButton.textContent = text;
        pageButton.classList.add("pagination-button");
        
        if (page === currentPage) {
            pageButton.classList.add("active");
        }

        pageButton.addEventListener("click", () => {
            currentPage = page;
            renderPage(currentPage); // Обновляем список слов для выбранной страницы
            renderPagination(); // Обновляем кнопки пагинации
        });

        paginationContainer.appendChild(pageButton);
    };

    // Всегда показываем первую страницу
    addPageButton(1);

    // Добавляем многоточие, если между первой страницей и текущей есть промежуток
    if (currentPage > 3) {
        paginationContainer.appendChild(document.createTextNode('...'));
    }

    // Отображаем номера страниц вокруг текущей
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
        addPageButton(i);
    }

    // Добавляем многоточие, если между текущей страницей и последней есть промежуток
    if (currentPage < totalPages - 2) {
        paginationContainer.appendChild(document.createTextNode('...'));
    }

    // Всегда показываем последнюю страницу
    if (totalPages > 1) {
        addPageButton(totalPages);
    }
}

// Функция для обновления активного состояния кнопок пагинации
function updatePagination() {
    Array.from(paginationContainer.children).forEach((button, index) => {
        button.classList.toggle("active", index + 1 === currentPage);
    });
}

// Функция удаления слова
function deleteWord(wordId) {
    deleteWordFromServer(wordId).then(() => {
        allWords = allWords.filter(word => word.id !== wordId); // Удаляем слово из массива
        totalPages = Math.ceil(allWords.length / wordsPerPage); // Обновляем общее количество страниц
        if (currentPage > totalPages) {
            currentPage = totalPages; // Переходим на последнюю страницу, если текущая пустая
        }
        renderPage(currentPage); // Обновляем слова для текущей страницы
        renderPagination(); // Пересоздаем кнопки пагинации
    }).catch(error => {
        console.error('Error deleting word:', error);
        alert('Не удалось удалить слово.');
    });
}

// Функция для фильтрации слов по поисковому запросу
function filterWords(query) {
    query = query.toLowerCase();
    const filteredWords = allWords.filter(word => 
        word.eng_word.toLowerCase().includes(query) || 
        word.rus_word.toLowerCase().includes(query)
    );

    wordsList.innerHTML = '';
    renderWords(filteredWords, wordsList, deleteWord);
}

// Обработчик для поиска
searchInput.addEventListener('input', (e) => {
    const query = e.target.value;
    filterWords(query);
});

// Начальная загрузка всех слов при загрузке страницы
document.addEventListener("DOMContentLoaded", () => loadAllWords());
