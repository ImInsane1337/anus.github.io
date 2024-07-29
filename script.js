const encryptionKey = 'supersecretkey'; // Вы можете изменить на более сложный ключ

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
    const encryptedCount = getCookie('counter');
    if (encryptedCount) {
        const decryptedCount = decrypt(encryptedCount, encryptionKey);
        count = parseInt(decryptedCount, 10);
    } else {
        count = 0;
    }
    updateCounter();
}

function updateCounter() {
    document.getElementById('counter').textContent = formatNumber(count);
    const encryptedCount = encrypt(count.toString(), encryptionKey);
    setCookie('counter', encryptedCount);
}

function updateUpgradeInfo() {
    const upgrades = parseUpgrades(decrypt(getCookie('upgrades') || '', encryptionKey));
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

function buyUpgrade(upgrade) {
    let upgrades = getCookie('upgrades');
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
        const autoclickCost = (upgrades.autoclick.level ? 100 * (upgrades.autoclick.level + 1) : 100);
        if (count >= autoclickCost) {
            count -= autoclickCost;
            upgrades.autoclick.level = (upgrades.autoclick.level || 0) + 1;
            upgrades.autoclick.interval = Math.max(autoClickInterval - 1000, 1000); // Уменьшить интервал на 1 секунду до минимума 1 секунда
            autoClickInterval = upgrades.autoclick.interval;
            updateCounter();
            setCookie('upgrades', encrypt(formatUpgrades(upgrades), encryptionKey));
            updateUpgradeInfo();
            startAutoClicker();
        }
    } else if (upgrade === 'clickpower') {
        const clickpowerCost = (upgrades.clickpower.level ? 50 * (upgrades.clickpower.level + 1) : 50);
        if (count >= clickpowerCost) {
            count -= clickpowerCost;
            upgrades.clickpower.level = (upgrades.clickpower.level || 0) + 1;
            upgrades.clickpower.power = (upgrades.clickpower.power || 1) + 1; // Увеличиваем силу клика
            clickPower = upgrades.clickpower.power;
            updateCounter();
            setCookie('upgrades', encrypt(formatUpgrades(upgrades), encryptionKey));
            updateUpgradeInfo();
        }
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

let autoClickIntervalId = setInterval(() => {
    count += clickPower;
    updateCounter();
}, autoClickInterval);

window.onload = () => {
    getNickname();
    initCounter();
    updateUpgradeInfo();
};
