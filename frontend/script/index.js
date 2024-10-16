import { sendWords } from './api.js'; // Импортируем функцию

document.addEventListener('DOMContentLoaded', () => {
    // Пример добавления обработчика событий для инпутов
    const inputs = document.querySelectorAll('input[data-lang]');
    const validateInput = (event) => {
        let input = event.target.value;
        const language = event.target.getAttribute('data-lang'); // Получаем язык из атрибута data-lang
        input = input.toLowerCase();
        // Проверяем, какое поле (английское или русское)
        if (language === 'en') {
            // Разрешаем только английские буквы и одиночные пробелы
            input = input.replace(/[^a-z\s]/g, '');
        } else if (language === 'ru') {
            // Разрешаем только русские буквы и одиночные пробелы
            input = input.replace(/[^а-я\s]/g, '');
        }
        // Запрещаем два пробела подряд
        input = input.replace(/\s{2,}/g, ' ');
        // Обновляем значение input
        event.target.value = input;
    };

    inputs.forEach(input => {
        input.addEventListener('input', validateInput); // Используем функцию
    });
    
    const sendButton = document.getElementById('send-button');
    const englishWordInput = document.getElementById('english-word');
    const russianWordInput = document.getElementById('russian-word');
    const messageDiv = document.getElementById('message'); // Получаем элемент для сообщения

    // Функция для показа сообщения
    const showMessage = (message, color) => {
        messageDiv.textContent = message;
        messageDiv.style.color = color;
        messageDiv.style.visibility = 'visible'; // Делаем сообщение видимым

        // Устанавливаем таймер на 3 секунды для скрытия сообщения
        setTimeout(() => {
            messageDiv.style.visibility = 'hidden';
        }, 3000); // 3000 миллисекунд = 3 секунды
    };

    // Обработчик события отправки формы
    sendButton.addEventListener('click', async (event) => {
        event.preventDefault(); // Останавливаем стандартную отправку формы

        const englishWord = englishWordInput.value.trim(); // Получаем значения инпутов
        const russianWord = russianWordInput.value.trim();

        if (englishWord && russianWord) {
            try {
                const response = await sendWords(russianWord, englishWord); // Вызываем функцию отправки
                console.log('Words sent successfully:', response);
                showMessage('Слово добавлено в словарь', 'white'); // Успех
                // Очищаем поля ввода
                englishWordInput.value = '';
                russianWordInput.value = '';
            } catch (error) {
                console.error('Failed to send words:', error);
                showMessage('Слово уже есть в словаре', 'red'); // Ошибка
            }
        } else {
            showMessage('Заполните оба поля', 'orange'); // Поля не заполнены
        }
    });

});

import { setNavLinkActiveState } from './utils.js'

document.querySelectorAll('nav a').forEach(link => {
    setNavLinkActiveState([link]);  // Передаем массив с одной ссылкой
});




