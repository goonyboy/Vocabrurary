//Выделение активной вкладки
export function setNavLinkActiveState(navLinks) {
    navLinks.forEach(link => {
        if (link.href === window.location.href) {
            link.setAttribute('data-active', 'true');
        } else {
            link.setAttribute('data-active', 'false');
        }
    });
}
export const validateInput = (event) => {
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

export function renderWords(words, container, onDelete) {
    words.forEach(wordObj => {
        const wordElement = document.createElement('div');
        wordElement.classList.add('word-item');

        wordElement.innerHTML = `
            <p><strong>${wordObj.eng_word}</strong>: ${wordObj.rus_word}</p>
        `;

        // Создание кнопки удаления
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Удалить';
        deleteButton.classList.add('delete-button');

        // Обработчик клика по кнопке удаления
        deleteButton.addEventListener('click', () => {
            onDelete(wordObj.id); // Вызываем функцию удаления при нажатии
        });

        wordElement.appendChild(deleteButton); // Добавляем кнопку в блок со словом
        container.appendChild(wordElement);
    });
}
