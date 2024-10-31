const BASE_URL = 'http://37.252.5.123:8000/words';

// Функция для отправки слов на сервер
export const sendWords = async (rus_word, eng_word) => {
    try {
        const response = await axios.post(`${BASE_URL}`, {
            rus_word: rus_word,
            eng_word: eng_word
        });
        return response.data;
    } catch (error) {
        console.error('Error posting data:', error);
        throw error;
    }
};

// Функция для получения слов с учетом пагинации и фильтрации
export function getWords(page, wordsPerPage, wordFilter = '') {
    const query = wordFilter ? `&word_filter=${encodeURIComponent(wordFilter)}` : '';
    return axios.get(`${BASE_URL}?page=${page}&size=${wordsPerPage}${query}`);
}

// Функция для удаления слова
export function deleteWordFromServer(wordId) {
    return axios.delete(`${BASE_URL}/${wordId}`);
}


// Функция которая передает рандомные слова в карточку
export const getRandomWords = async () => {
    try {
        const response = await axios.get(`${BASE_URL}`); // Замените на правильный эндпоинт
        return response.data.items; // Предполагается, что API возвращает массив слов в поле 'items'
    } catch (error) {
        console.error('Ошибка при получении случайных слов:', error);
        return []; // Возвращаем пустой массив в случае ошибки
    }
};