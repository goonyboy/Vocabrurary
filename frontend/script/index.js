import { sendWords } from './api.js'; // Импортируем функцию для отправки слов на сервер в БД
import { validateInput } from './utils.js'; // Импортируем функцию для валидации инпутов

document.addEventListener('DOMContentLoaded', () => {

    // Обработчик события для инпутов
    const inputs = document.querySelectorAll('input[data-lang]');
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
//Делаем вкладку "активной"
document.querySelectorAll('nav a').forEach(link => {
    setNavLinkActiveState([link]);  // Передаем массив с одной ссылкой
});




