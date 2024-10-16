// api.js
export const sendWords = async (rusWord, engWord) => {
    try {
        const response = await axios.post('http://37.252.5.123:8000/words', {
            rus_word: rusWord,
            eng_word: engWord
        });
        return response.data; // Возвращаем данные ответа
    } catch (error) {
        console.error('Error posting data:', error);
        throw error; // Пробрасываем ошибку для обработки в app.js
    }
};

