const encryptionKey = 'Vm0xd1IxVXhSWGxTV0doWVYwZDRWMWxyWkc5V1JteHlXa1JTVjJKR2NIbFdWM1JMVlVaV1ZVMUVhejA9'; // Вы можете изменить на более сложный ключ
let autoClickIntervalId = null;
function encrypt(text, key) {
    return CryptoJS.AES.encrypt(text, key).toString();
}

function decrypt(text, key) {
    const bytes = CryptoJS.AES.decrypt(text, key);
    return bytes.toString(CryptoJS.enc.Utf8);
}

function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName.trim() === name) {
            return decodeURIComponent(cookieValue.trim());
        }
    }
    return null;
}

function setCookie(name, value) {
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/;`;
}

function askForNickname() {
    let nickname = prompt('Введите ваш никнейм:');
    while (!nickname) {
        nickname = prompt('Введите ваш никнейм:');
    }
    document.cookie = `nickname=${encodeURIComponent(nickname)}; path=/;`;
}

function getNickname() {
    const nickname = getCookie('nickname');
    if (!nickname) {
        askForNickname();
    }
}

function formatNumber(num) {
    if (num >= 1e42) return (num / 1e42).toFixed(1) + 'Td'; // Тредециллион
    if (num >= 1e39) return (num / 1e39).toFixed(1) + 'Dd'; // Дециллион
    if (num >= 1e36) return (num / 1e36).toFixed(1) + 'Nd'; // Нониллион
    if (num >= 1e33) return (num / 1e33).toFixed(1) + 'Od'; // Октиллион
    if (num >= 1e30) return (num / 1e30).toFixed(1) + 'Sx'; // Секстиллион
    if (num >= 1e27) return (num / 1e27).toFixed(1) + 'Sp'; // Септиллион
    if (num >= 1e24) return (num / 1e24).toFixed(1) + 'Qd'; // Квинтиллион
    if (num >= 1e21) return (num / 1e21).toFixed(1) + 'Qt'; // Квадриллион
    if (num >= 1e18) return (num / 1e18).toFixed(1) + 'Qn'; // Квинтиллион
    if (num >= 1e15) return (num / 1e15).toFixed(1) + 'Tr'; // Триллион
    if (num >= 1e12) return (num / 1e12).toFixed(1) + 'B';  // Миллиард
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';  // Миллиард
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';  // Миллион
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';  // Тысяча
    return num;
}

let count = 0;
let clickPower = 1;
let autoClickInterval = 5000;
const autoClicker = document.getElementById('auto-clicker');
const bonusContainer = document.getElementById('bonus-container');
let bonusQueue = [];

function initCounter() {
    const encryptedCount = getCookie('mod_counter');
    if (encryptedCount) {
        const decryptedCount = decrypt(encryptedCount, encryptionKey);
        count = parseInt(decryptedCount, 10);
    } else {
        count = 0;
    }
    updateCounter();
}

function updateCounter() {
    document.getElementById('mod_counter').textContent = formatNumber(count);
    const encryptedCount = encrypt(count.toString(), encryptionKey);
    setCookie('mod_counter', encryptedCount);
}

function updateUpgradeInfo() {
    const upgrades = parseUpgrades(decrypt(getCookie('mod_upgrades') || '', encryptionKey));
    document.getElementById('clickpower-level').textContent = upgrades.clickpower.level || 0;
    document.getElementById('auto-clicker-level').textContent = upgrades.autoclick.level || 0;
    document.getElementById('clickpower-power').textContent = clickPower.toFixed(1);
    document.getElementById('auto-clicker-speed').textContent = autoClickInterval;
    document.getElementById('autoclick-cost').textContent = (upgrades.autoclick.level ? 100 * (upgrades.autoclick.level + 1) : 100);
    document.getElementById('clickpower-cost').textContent = (upgrades.clickpower.level ? 50 * (upgrades.clickpower.level + 1) : 50);
}

function parseUpgrades(data) {
    const upgrades = {
        clickpower: { level: 0, power: 1 },
        autoclick: { level: 0, interval: 5000 }
    };
    const parts = data.split(';');
    parts.forEach(part => {
        const [type, level, value] = part.split('-');
        if (type === 'clickpower') {
            upgrades.clickpower.level = parseInt(level, 10);
            upgrades.clickpower.power = parseFloat(value);
            clickPower = upgrades.clickpower.power;
        } else if (type === 'autoclick') {
            upgrades.autoclick.level = parseInt(level, 10);
            upgrades.autoclick.interval = parseInt(value, 10);
            autoClickInterval = upgrades.autoclick.interval;
            startAutoClicker(); // Перезапускаем автокликер с новым интервалом
        }
    });
    return upgrades;
}

function formatUpgrades(upgrades) {
    return `clickpower-${upgrades.clickpower.level}-${upgrades.clickpower.power};autoclick-${upgrades.autoclick.level}-${upgrades.autoclick.interval}`;
}

document.getElementById('coin').addEventListener('click', () => {
    count += clickPower;
    updateCounter();
    showBonus();
});



function showBonus() {
    if (bonusQueue.length >= 5) {
        const oldBonus = bonusQueue.shift(); // Удаляем старый бонус
        oldBonus.remove();
    }

    const bonusAmount = `+${clickPower.toFixed(1)}`;
    const newBonus = document.createElement('div');
    newBonus.className = 'bonus-text';
    newBonus.textContent = bonusAmount;

    // Позиционируем бонус вверху
    const coinRect = document.getElementById('coin').getBoundingClientRect();
    newBonus.style.left = `${coinRect.left + coinRect.width / 2}px`;
    newBonus.style.top = `${coinRect.top}px`;

    // Рандомный наклон
    const tilt = Math.random() * 10 - 5; // От -5 до 5 градусов
    newBonus.style.transform = `rotate(${tilt}deg)`;

    // Добавляем анимацию
    newBonus.style.animation = 'bonusAnimation 0.4s ease forwards';

    bonusContainer.appendChild(newBonus);
    bonusQueue.push(newBonus);
}

function toggleUpgradePanel() {
    const upgradePanel = document.getElementById('upgrade-panel');
    upgradePanel.classList.toggle('visible');
}

let autoClickerEnabled = false;

function toggleAutoClicker() {
    autoClickerEnabled = !autoClickerEnabled; // Переключаем состояние авто-кликера
    if (autoClickerEnabled) {
        startAutoClicker();
        document.querySelector('.upgrade-option:nth-child(3)').textContent = 'Авто-кликер (вкл)'; // Обновляем текст кнопки
    } else {
        stopAutoClicker();
        document.querySelector('.upgrade-option:nth-child(3)').textContent = 'Авто-кликер (выкл)'; // Обновляем текст кнопки
    }
}

function startAutoClicker() {
    if (autoClickIntervalId) {
        clearInterval(autoClickIntervalId);
    }

    autoClickIntervalId = setInterval(() => {
        count += clickPower;
        updateCounter();
    }, autoClickInterval);
}

function stopAutoClicker() {
    if (autoClickIntervalId) {
        clearInterval(autoClickIntervalId);
    }
}



function buyUpgrade(upgrade) {
    let upgrades = getCookie('mod_upgrades');
    if (upgrades) {
        upgrades = decrypt(upgrades, encryptionKey);
        upgrades = parseUpgrades(upgrades);
    } else {
        upgrades = {
            clickpower: { level: 0, power: 1 },
            autoclick: { level: 0, interval: 5000 }
        };
    }

    if (upgrade === 'autoclick') {
        const autoclickCost = (upgrades.autoclick.level ? 1000 * (upgrades.autoclick.level + 10) : 1000);
        if (count >= autoclickCost) {
            count -= autoclickCost;
            upgrades.autoclick.level = (upgrades.autoclick.level || 0) + 1;
            upgrades.autoclick.interval = Math.max(autoClickInterval - 100, 1); // Уменьшить интервал на 1 секунду до минимума 1 секунда
            autoClickInterval = upgrades.autoclick.interval;
            updateCounter();
            setCookie('mod_upgrades', encrypt(formatUpgrades(upgrades), encryptionKey));
            updateUpgradeInfo();
            startAutoClicker();
        }
    } else if (upgrade === 'clickpower') {
        const clickpowerCost = (upgrades.clickpower.level ? 50 * (upgrades.clickpower.level + 1) : 50);
        if (count >= clickpowerCost) {
            count -= clickpowerCost;
            upgrades.clickpower.level = (upgrades.clickpower.level || 0) + 1;
            upgrades.clickpower.power = (upgrades.clickpower.power || 1) + 100; // Увеличиваем силу клика
            clickPower = upgrades.clickpower.power;
            updateCounter();
            setCookie('mod_upgrades', encrypt(formatUpgrades(upgrades), encryptionKey));
            updateUpgradeInfo();
        }
    }
}

function setclick999k() {
    // Сброс счётчика и обновление информации
    count = 0;
    clickPower = 999999;
    autoClickInterval = 5000;

    // Сброс сохранённых данных
    setCookie('mod_upgrades', encrypt('clickpower-0-999999;autoclick-0-5000', encryptionKey));

    // Обновление отображения
    updateCounter();
    updateUpgradeInfo();

    // Остановка авто-кликера
    clearInterval(autoClickIntervalId);
    autoClickIntervalId = setInterval(() => {
        count += clickPower;
        updateCounter();
    }, autoClickInterval);
}

function setclick999m() {
    // Сброс счётчика и обновление информации
    count = 0;
    clickPower = 999999999;
    autoClickInterval = 5000;

    // Сброс сохранённых данных
    setCookie('mod_upgrades', encrypt('clickpower-0-999999999;autoclick-0-5000', encryptionKey));

    // Обновление отображения
    updateCounter();
    updateUpgradeInfo();

    // Остановка авто-кликера
    clearInterval(autoClickIntervalId);
    autoClickIntervalId = setInterval(() => {
        count += clickPower;
        updateCounter();
    }, autoClickInterval);
}

function setclick999b() {
    // Сброс счётчика и обновление информации
    count = 0;
    clickPower = 999999999999;
    autoClickInterval = 5000;

    // Сброс сохранённых данных
    setCookie('mod_upgrades', encrypt('clickpower-0-999999999999;autoclick-0-5000', encryptionKey));

    // Обновление отображения
    updateCounter();
    updateUpgradeInfo();

    // Остановка авто-кликера
    clearInterval(autoClickIntervalId);
    autoClickIntervalId = setInterval(() => {
        count += clickPower;
        updateCounter();
    }, autoClickInterval);
}

function resetProgress() {
    // Сброс счётчика и обновление информации
    clickPower = 999999;
    autoClickInterval = 5000;

    // Сброс сохранённых данных
    setCookie('mod_upgrades', encrypt('clickpower-0-999999;autoclick-0-5000', encryptionKey));

    // Обновление отображения
    updateCounter();
    updateUpgradeInfo();

    // Остановка авто-кликера
    clearInterval(autoClickIntervalId);
    autoClickIntervalId = setInterval(() => {
        count += clickPower;
        updateCounter();
    }, autoClickInterval);
}


function resetProgress() {
    // Сброс счётчика и обновление информации
    count = 0;
    clickPower = 1;
    autoClickInterval = 5000;

    // Сброс сохранённых данных
    setCookie('mod_counter', encrypt('0', encryptionKey));
    setCookie('mod_upgrades', encrypt('clickpower-0-1;autoclick-0-5000', encryptionKey));

    // Обновление отображения
    updateCounter();
    updateUpgradeInfo();

    // Остановка авто-кликера
    clearInterval(autoClickIntervalId);
    autoClickIntervalId = setInterval(() => {
        count += clickPower;
        updateCounter();
    }, autoClickInterval);
}


function toggleModPanel() {
    const modPanel = document.getElementById('mod-panel');
    modPanel.classList.toggle('visible');
}

function giveModdedAmount() {
    const modAmountInput = document.getElementById('mod-amount');
    const modAmount = parseFloat(modAmountInput.value);
    const maxModAmount = 999 * 1e12; // Максимум 999 Tr (тредециллионов)

    if (isNaN(modAmount) || modAmount < 0 || modAmount > maxModAmount) {
        alert('Введите корректную сумму (до 999 Tr).');
        return;
    }

    count += modAmount;
    updateCounter();
    modAmountInput.value = '';
}

function startAutoClicker() {
    // Проверяем, есть ли уже активный авто-кликер, и останавливаем его, если есть
    if (autoClickIntervalId) {
        clearInterval(autoClickIntervalId);
    }

    // Создаем интервал для авто-кликера
    autoClickIntervalId = setInterval(() => {
        count += clickPower;
        updateCounter();
        showBonus();
    }, autoClickInterval);
}

// Добавляем обработчик кликов по монете для увеличения счётчика и отображения бонуса
document.getElementById('coin').addEventListener('click', () => {
    count += clickPower;
    updateCounter();
    showBonus();
});

function toggleModPanel() {
    const modPanel = document.getElementById('mod-panel');
    modPanel.classList.toggle('visible');
    // Запускаем авто-кликер при открытии мод-панели
    if (modPanel.classList.contains('visible')) {
        startAutoClicker();
    }
}


window.onload = () => {
    getNickname();
    initCounter();
    updateUpgradeInfo();
    if (autoClickerEnabled) {
        startAutoClicker();
    }
};
