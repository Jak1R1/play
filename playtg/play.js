// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand(); // Разворачиваем приложение на весь экран

// Основные переменные
let userData = {
    id: tg.initDataUnsafe.user?.id || 0,
    username: tg.initDataUnsafe.user?.username || 'Гость',
    firstName: tg.initDataUnsafe.user?.first_name || 'Пользователь',
    lastName: tg.initDataUnsafe.user?.last_name || '',
    photoUrl: tg.initDataUnsafe.user?.photo_url || 'https://via.placeholder.com/150',
    points: 0,
    level: 1,
    friends: [],
    achievements: []
};

// Игровые элементы
const GAME_ELEMENTS = {
    dailyBonus: true,
    likesBonus: 5,
    postBonus: 10,
    commentBonus: 3,
    friendBonus: 20,
    levelThresholds: [100, 300, 600, 1000, 1500]
};

// Инициализация приложения
function initApp() {
    loadUserData();
    renderUI();
    setupEventListeners();
}

// Загрузка данных пользователя
function loadUserData() {
    const savedData = localStorage.getItem('socialGameData');
    if (savedData) {
        userData = {...userData, ...JSON.parse(savedData)};
    }
}

// Сохранение данных пользователя
function saveUserData() {
    localStorage.setItem('socialGameData', JSON.stringify(userData));
}

// Рендер интерфейса
function renderUI() {
    document.body.innerHTML = '';
    document.body.style.fontFamily = 'Arial, sans-serif';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.backgroundColor = '#f5f5f5';
    
    // Яркий градиентный заголовок
    const header = document.createElement('header');
    header.style.background = 'linear-gradient(45deg, #ff6b6b, #4ecdc4)';
    header.style.color = 'white';
    header.style.padding = '15px';
    header.style.textAlign = 'center';
    header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    
    const title = document.createElement('h1');
    title.textContent = 'Social Game';
    title.style.margin = '0';
    title.style.fontSize = '24px';
    
    header.appendChild(title);
    document.body.appendChild(header);
    
    // Основной контейнер
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '15px';
    container.style.padding = '15px';
    
    // Профиль пользователя
    const profileCard = createProfileCard();
    container.appendChild(profileCard);
    
    // Действия
    const actionsCard = createActionsCard();
    container.appendChild(actionsCard);
    
    // Лента
    const feedCard = createFeedCard();
    container.appendChild(feedCard);
    
    document.body.appendChild(container);
}

// Создание карточки профиля
function createProfileCard() {
    const card = document.createElement('div');
    card.style.background = 'white';
    card.style.borderRadius = '12px';
    card.style.padding = '15px';
    card.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)';
    
    const profileHeader = document.createElement('div');
    profileHeader.style.display = 'flex';
    profileHeader.style.alignItems = 'center';
    profileHeader.style.gap = '15px';
    profileHeader.style.marginBottom = '15px';
    
    const avatar = document.createElement('img');
    avatar.src = userData.photoUrl;
    avatar.style.width = '60px';
    avatar.style.height = '60px';
    avatar.style.borderRadius = '50%';
    avatar.style.objectFit = 'cover';
    
    const userInfo = document.createElement('div');
    const userName = document.createElement('h3');
    userName.textContent = `${userData.firstName} ${userData.lastName}`;
    userName.style.margin = '0';
    userName.style.fontSize = '18px';
    
    const userLevel = document.createElement('p');
    userLevel.textContent = `Уровень ${userData.level}`;
    userLevel.style.margin = '5px 0 0';
    userLevel.style.fontSize = '14px';
    userLevel.style.color = '#666';
    
    userInfo.appendChild(userName);
    userInfo.appendChild(userLevel);
    
    profileHeader.appendChild(avatar);
    profileHeader.appendChild(userInfo);
    
    // Прогресс бар
    const progressContainer = document.createElement('div');
    progressContainer.style.marginBottom = '15px';
    
    const progressText = document.createElement('div');
    progressText.style.display = 'flex';
    progressText.style.justifyContent = 'space-between';
    progressText.style.marginBottom = '5px';
    
    const pointsText = document.createElement('span');
    pointsText.textContent = `${userData.points} очков`;
    
    const nextLevelText = document.createElement('span');
    const nextLevelThreshold = GAME_ELEMENTS.levelThresholds[userData.level - 1] || GAME_ELEMENTS.levelThresholds[GAME_ELEMENTS.levelThresholds.length - 1] * userData.level;
    nextLevelText.textContent = `До ${userData.level + 1} уровня: ${nextLevelThreshold - userData.points}`;
    
    progressText.appendChild(pointsText);
    progressText.appendChild(nextLevelText);
    
    const progressBar = document.createElement('div');
    progressBar.style.height = '10px';
    progressBar.style.background = '#e0e0e0';
    progressBar.style.borderRadius = '5px';
    progressBar.style.overflow = 'hidden';
    
    const progressFill = document.createElement('div');
    const progressPercentage = Math.min((userData.points / nextLevelThreshold) * 100, 100);
    progressFill.style.height = '100%';
    progressFill.style.width = `${progressPercentage}%`;
    progressFill.style.background = 'linear-gradient(90deg, #4ecdc4, #ff6b6b)';
    progressFill.style.transition = 'width 0.3s';
    
    progressBar.appendChild(progressFill);
    progressContainer.appendChild(progressText);
    progressContainer.appendChild(progressBar);
    
    // Бонусы
    const bonuses = document.createElement('div');
    bonuses.style.display = 'flex';
    bonuses.style.justifyContent = 'space-between';
    bonuses.style.flexWrap = 'wrap';
    bonuses.style.gap = '10px';
    
    const dailyBonusBtn = document.createElement('button');
    dailyBonusBtn.textContent = 'Ежедневный бонус';
    dailyBonusBtn.style.background = 'linear-gradient(45deg, #ff9a9e, #fad0c4)';
    dailyBonusBtn.style.border = 'none';
    dailyBonusBtn.style.padding = '8px 15px';
    dailyBonusBtn.style.borderRadius = '20px';
    dailyBonusBtn.style.color = 'white';
    dailyBonusBtn.style.fontWeight = 'bold';
    dailyBonusBtn.style.cursor = 'pointer';
    dailyBonusBtn.style.flex = '1';
    dailyBonusBtn.style.minWidth = '150px';
    dailyBonusBtn.addEventListener('click', claimDailyBonus);
    
    const inviteFriendBtn = document.createElement('button');
    inviteFriendBtn.textContent = 'Пригласить друга';
    inviteFriendBtn.style.background = 'linear-gradient(45deg, #a18cd1, #fbc2eb)';
    inviteFriendBtn.style.border = 'none';
    inviteFriendBtn.style.padding = '8px 15px';
    inviteFriendBtn.style.borderRadius = '20px';
    inviteFriendBtn.style.color = 'white';
    inviteFriendBtn.style.fontWeight = 'bold';
    inviteFriendBtn.style.cursor = 'pointer';
    inviteFriendBtn.style.flex = '1';
    inviteFriendBtn.style.minWidth = '150px';
    inviteFriendBtn.addEventListener('click', inviteFriend);
    
    bonuses.appendChild(dailyBonusBtn);
    bonuses.appendChild(inviteFriendBtn);
    
    card.appendChild(profileHeader);
    card.appendChild(progressContainer);
    card.appendChild(bonuses);
    
    return card;
}

// Создание карточки действий
function createActionsCard() {
    const card = document.createElement('div');
    card.style.background = 'white';
    card.style.borderRadius = '12px';
    card.style.padding = '15px';
    card.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)';
    
    const title = document.createElement('h3');
    title.textContent = 'Действия';
    title.style.marginTop = '0';
    title.style.color = '#333';
    
    const actions = document.createElement('div');
    actions.style.display = 'grid';
    actions.style.gridTemplateColumns = 'repeat(auto-fill, minmax(120px, 1fr))';
    actions.style.gap = '10px';
    
    const actionButtons = [
        { text: 'Создать пост', color: 'linear-gradient(45deg, #ff9a9e, #fad0c4)', action: createPost },
        { text: 'Лайкнуть', color: 'linear-gradient(45deg, #a1c4fd, #c2e9fb)', action: likePost },
        { text: 'Комментировать', color: 'linear-gradient(45deg, #ffc3a0, #ffafbd)', action: addComment },
        { text: 'Друзья', color: 'linear-gradient(45deg, #a18cd1, #fbc2eb)', action: showFriends }
    ];
    
    actionButtons.forEach(btn => {
        const button = document.createElement('button');
        button.textContent = btn.text;
        button.style.background = btn.color;
        button.style.border = 'none';
        button.style.padding = '10px';
        button.style.borderRadius = '8px';
        button.style.color = 'white';
        button.style.fontWeight = 'bold';
        button.style.cursor = 'pointer';
        button.addEventListener('click', btn.action);
        
        actions.appendChild(button);
    });
    
    card.appendChild(title);
    card.appendChild(actions);
    
    return card;
}

// Создание карточки ленты
function createFeedCard() {
    const card = document.createElement('div');
    card.style.background = 'white';
    card.style.borderRadius = '12px';
    card.style.padding = '15px';
    card.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)';
    
    const title = document.createElement('h3');
    title.textContent = 'Лента';
    title.style.marginTop = '0';
    title.style.color = '#333';
    
    const feed = document.createElement('div');
    feed.style.display = 'flex';
    feed.style.flexDirection = 'column';
    feed.style.gap = '15px';
    
    // Пример поста
    const post = createPostExample();
    feed.appendChild(post);
    
    card.appendChild(title);
    card.appendChild(feed);
    
    return card;
}

// Создание примера поста
function createPostExample() {
    const post = document.createElement('div');
    post.style.border = '1px solid #eee';
    post.style.borderRadius = '10px';
    post.style.padding = '15px';
    
    const postHeader = document.createElement('div');
    postHeader.style.display = 'flex';
    postHeader.style.alignItems = 'center';
    postHeader.style.gap = '10px';
    postHeader.style.marginBottom = '10px';
    
    const postAvatar = document.createElement('img');
    postAvatar.src = 'https://via.placeholder.com/40';
    postAvatar.style.width = '40px';
    postAvatar.style.height = '40px';
    postAvatar.style.borderRadius = '50%';
    
    const postUser = document.createElement('div');
    const postUserName = document.createElement('p');
    postUserName.textContent = 'Другой пользователь';
    postUserName.style.margin = '0';
    postUserName.style.fontWeight = 'bold';
    
    const postTime = document.createElement('p');
    postTime.textContent = '2 часа назад';
    postTime.style.margin = '0';
    postTime.style.fontSize = '12px';
    postTime.style.color = '#999';
    
    postUser.appendChild(postUserName);
    postUser.appendChild(postTime);
    
    postHeader.appendChild(postAvatar);
    postHeader.appendChild(postUser);
    
    const postContent = document.createElement('p');
    postContent.textContent = 'Это пример поста в нашей социальной сети. Здесь может быть любой текст, изображения или другие медиа.';
    postContent.style.margin = '0 0 10px';
    
    const postImage = document.createElement('img');
    postImage.src = 'https://via.placeholder.com/300x150';
    postImage.style.width = '100%';
    postImage.style.borderRadius = '8px';
    postImage.style.marginBottom = '10px';
    
    const postActions = document.createElement('div');
    postActions.style.display = 'flex';
    postActions.style.gap = '15px';
    
    const likeBtn = document.createElement('button');
    likeBtn.innerHTML = '❤️ Лайк';
    likeBtn.style.background = 'none';
    likeBtn.style.border = 'none';
    likeBtn.style.color = '#666';
    likeBtn.style.cursor = 'pointer';
    likeBtn.addEventListener('click', () => {
        addPoints(GAME_ELEMENTS.likesBonus);
        likeBtn.innerHTML = '❤️ Лайк (+5)';
        setTimeout(() => {
            likeBtn.innerHTML = '❤️ Лайк';
        }, 1000);
    });
    
    const commentBtn = document.createElement('button');
    commentBtn.innerHTML = '💬 Комментировать';
    commentBtn.style.background = 'none';
    commentBtn.style.border = 'none';
    commentBtn.style.color = '#666';
    commentBtn.style.cursor = 'pointer';
    commentBtn.addEventListener('click', () => {
        addPoints(GAME_ELEMENTS.commentBonus);
        commentBtn.innerHTML = '💬 Комментировать (+3)';
        setTimeout(() => {
            commentBtn.innerHTML = '💬 Комментировать';
        }, 1000);
    });
    
    postActions.appendChild(likeBtn);
    postActions.appendChild(commentBtn);
    
    post.appendChild(postHeader);
    post.appendChild(postContent);
    post.appendChild(postImage);
    post.appendChild(postActions);
    
    return post;
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Можно добавить дополнительные обработчики
}

// Функции действий
function claimDailyBonus() {
    if (userData.lastDailyBonus && new Date().toDateString() === new Date(userData.lastDailyBonus).toDateString()) {
        showNotification('Вы уже получали бонус сегодня!');
        return;
    }
    
    const bonus = 50 + Math.floor(Math.random() * 50);
    addPoints(bonus);
    userData.lastDailyBonus = new Date();
    saveUserData();
    
    showNotification(`🎉 Вы получили ежедневный бонус: ${bonus} очков!`);
    renderUI();
}

function inviteFriend() {
    if (tg.platform !== 'unknown') {
        tg.shareLink({
            title: 'Присоединяйся!',
            text: 'Присоединяйся к нашей социальной сети с игровыми элементами!',
            url: 'https://t.me/your_app_link'
        });
    } else {
        showNotification('Пригласите друзей через Telegram!');
    }
    
    addPoints(GAME_ELEMENTS.friendBonus);
}

function createPost() {
    showNotification('Создание нового поста...');
    addPoints(GAME_ELEMENTS.postBonus);
}

function likePost() {
    showNotification('Лайк поставлен!');
    addPoints(GAME_ELEMENTS.likesBonus);
}

function addComment() {
    showNotification('Комментарий добавлен!');
    addPoints(GAME_ELEMENTS.commentBonus);
}

function showFriends() {
    showNotification('Список друзей');
}

// Добавление очков и проверка уровня
function addPoints(points) {
    userData.points += points;
    
    // Проверка уровня
    const currentLevelThreshold = GAME_ELEMENTS.levelThresholds[userData.level - 1] || GAME_ELEMENTS.levelThresholds[GAME_ELEMENTS.levelThresholds.length - 1] * userData.level;
    
    if (userData.points >= currentLevelThreshold) {
        userData.level++;
        showNotification(`🎉 Поздравляем! Вы достигли ${userData.level} уровня!`);
    }
    
    saveUserData();
    renderUI();
}

// Показать уведомление
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.background = 'linear-gradient(45deg, #4ecdc4, #ff6b6b)';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '20px';
    notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    notification.style.zIndex = '1000';
    notification.style.animation = 'fadeInOut 2.5s';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2500);
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', initApp);

// Добавляем стили для анимации
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translateX(-50%) translateY(20px); }
        10% { opacity: 1; transform: translateX(-50%) translateY(0); }
        90% { opacity: 1; transform: translateX(-50%) translateY(0); }
        100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
    }
`;
document.head.appendChild(style);
