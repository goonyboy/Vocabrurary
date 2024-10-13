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