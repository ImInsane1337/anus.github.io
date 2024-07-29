// Установка cookie с зашифрованным значением
function setEncryptedCookie(name, value) {
    const encryptedValue = encrypt(value); // Шифруем значение
    document.cookie = `${name}=${encryptedValue}; path=/;`;
}

// Получение значения cookie и его расшифровка
function getDecryptedCookie(name) {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName.trim() === name) {
            return decrypt(cookieValue.trim()); // Дешифруем значение
        }
    }
    return null;
}

// Шифрование и дешифрование значений в JavaScript
function encrypt(value) {
    // Вставьте сюда код для шифрования (например, с использованием библиотеки CryptoJS)
    return value; // Для примера возвращаем значение без шифрования
}

function decrypt(value) {
    // Вставьте сюда код для дешифрования (например, с использованием библиотеки CryptoJS)
    return value; // Для примера возвращаем значение без дешифрования
}

// Пример использования
document.getElementById('coin').addEventListener('click', () => {
    let count = parseInt(getDecryptedCookie('counter') || '0');
    count++;
    setEncryptedCookie('counter', count);
    document.getElementById('counter').textContent = count;
});
