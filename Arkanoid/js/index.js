(function() {
'use strict'

/*-------------------------------- Флаги -----------------------------------------------*/

let isGameStarted = false; // Флаг: Состояние игры.
//let isNextLevel = false; // Флаг: Переход на следующий уровень.
let isBallActive = true; // Флаг: Состояние Мячика.

/*------------------------- Кнопка Старта Игры --------------------------------*/

const startGame = document.querySelector('.startGame'); // Получаем кнопку по селектору.

startGame.addEventListener('click', () => { // Добавляем событие на кнопку.
  startGame.style.opacity = 0; // Делаем кнопку прозрачной.

  setTimeout(() => {
    startGame.style.display = 'none'; // Убираем кнопку с экрана с замедлением.
    isGameStarted = true; // Состояние игры.
    isBallActive = true;  // Флаг: Состояние мячика.
  }, 300);

  clickButton(); // Функция звука кнопки.
});

/*------------------------- Рисуем Канвас --------------------------------*/

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

/*------------------------- Рисуем Мячик --------------------------------*/
let x = 400; // Координаты центра мячика на канвасе.
let y = 300;

const ballSize = 25; // Радиус Мячика.

function drawBall() { // Функция отрисовки мячика.
  ctx.save();

  ctx.beginPath(); // Начинаем рисовать.
  ctx.shadowColor = 'rgba(255, 255, 255, 0.9)'; // Рисуем тень вокруг мячика.
  ctx.shadowBlur = 15;

  ctx.arc(x, y, ballSize, 0, Math.PI * 2); // Рисуем мячик.
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.fill();

  ctx.restore();

  ctx.beginPath(); // Начинаем рисовать.
  ctx.arc(x, y, ballSize, 0, Math.PI * 2); // Рисуем контур мячика.
  ctx.strokeStyle = 'rgb(0, 0, 0)';
  ctx.lineWidth = 1;
  ctx.stroke();
};

/*----------------------------- Анимация Мячика ---------------------------*/
// Задаю Скорость мячика по горизонтали и вертикали.
let dx = 3; // Движение по горизонтали.
let dy = 3; // Движение по вертикали.

function draw() { // Главный игровой цикл.
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Очистка канвас перед каждым кадром.

  if (!isGameStarted) return; // Состояние игры.

  // Отрисовываем все объекты:
  drawBall(); // Мячик.
  drawPaddle(); // Платформа.
  drawBricks(); // Кирпичики.
  drawParticles(); // Частици.
  collisionDetection(); // Столкновение с кирпичиками.

  // Движение мячика.
  if (isBallActive) {
    x += dx; // Двигаем мячик прибавляя скорость к координатам.
    y += dy;

    // Отскок от платформы.
    if (y + ballSize >= paddleY && x >= paddleX && x <= paddleX + paddleWidth) { // Мячик достиг уровня платформы по х.
      dy = -Math.abs(dy); // Гарантируем отскок вверх (dy всегда отрицательный).
      const hitPoint = x - (paddleX + paddleWidth / 2); // Расстояние от центра платформы до точки удара.
      dx = hitPoint * 0.2; // Мячик отлетает в сторону удара(меняем угол отскока).
      dx = Math.max(Math.min(dx, 6), -6); // Держим скорость в диапазон от -6 до 6, (чтобы мячик был не слишком быстрым).

      hitRocket(); // Функция звука платформы.
    };

    // Отскок от боковых стен.
    if (x > canvas.width - ballSize || x < ballSize) {
      dx *= -1; // Меняем направление движения мячика.
      hitWall(); // Функция звука стен и потолка.
    };

    // Отскок от потолка.
    if (y < ballSize) { // Верхняя граница.
      dy *= -1; // Меняю направление движения мячика.
      hitWall(); // Функция звука стен и потолка.
    };

    // Падение в воду(Game Over).
    if (y - ballSize > canvas.height) { // Мяч уходит вниз за экран.
      resetGame(); // Функция сброса игры.
      fellWater(); // Функция звука падения в воду.
    };
  };
};

setInterval(draw, 16); // Функция игрового цикла(60 кадров в секунду).

/*---------------------------- Сброс Игры -------------------------------*/

function resetGame() { // Возвращает игру в начальное состояние.
  // Останавливаем игру и мячик.
  isGameStarted = false; // Состояние игры.
  isBallActive = false; // Состояние мячика.

  score = 0; // Обнуляем счет игры.
  updateScore(); // Функция обновления счета игры.

  level = 1; // Обнуляем уровень игры.
  updateLevel(); // Функция обновления уровня игры.

  // Возвращаем мячик и платформу в стартовое состояние(центр экрана).
  x = canvas.width / 2;
  y = canvas.height / 2;

  // Скорость возвращаем стандартную.
  dx = 3;
  dy = 3;

  // Платформа возвращается в центр.
  paddleX = canvas.width / 2 - paddleWidth / 2;

  // Настройка кирпичиков(возвращаем параметры в стартовое состояние).
  brickRowCount = 4; // Ряды кирпичиков.
  brickColumnCount = 5; // Столбци кирпичиков.

  brickWidth = 80;   // Ширина кирпичика.
  brickHeight = 25; // Высота кирпичика.

  brickPadding = 15;  // Отступы кирпичиков.
  brickOffsetTop = 50;  // Расстояние от верхнего края.

  brickColor = 'rgba(213, 68, 0, 0.6)'; // Цвет кирпичика.

  initBricks(); // Восстанавливаем кирпичики.

  const textStartGame = document.querySelector('.startGame p'); // Получаем текст кнопки.
  textStartGame.textContent = 'Game Over'; // Меняем текст кнопки.

  startGame.style.display = 'inline-flex'; // Возвращаем кнопку на экран.
  startGame.style.opacity = 1; // Убираем прозрачность кнопки.
};

/*----------------------------- Платформа --------------------------------*/
// Размер Платформы.
let paddleWidth = 100; // Ширина платформы.
let paddleHeight = 25; // Высота платформы.

// Позиция платформы.
let paddleX = canvas.width / 2 - paddleWidth / 2; // По середине канваса(по горизонтали).
let paddleY = canvas.height - 20; // На 20px выше нижнего края(по вертикали).

// Функция отрисовки платформы(каждый кадр).
function drawPaddle() {
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'; // Тень платформы.
  ctx.shadowBlur = 2;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = -1;

  ctx.beginPath(); // Рисуем платформу.
  ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
  ctx.fillStyle = 'rgba(191, 172, 0, 0.8)';
  ctx.fill();
  ctx.closePath();

  ctx.strokeStyle = 'rgba(255, 255, 255, 1)'; // Контур платформы.
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.shadowColor = 'transparent'; // Сброс тени(что бы не применялась к другим объектам).
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
};

// Управление платформы мышью.
canvas.addEventListener('mousemove', (e) => {
  if (!isGameStarted) return; // Состояние игры.

  const rect = canvas.getBoundingClientRect(); // Получаем позицию мыши относительно канваса.
  const mouseX = e.clientX - rect.left; // Перевожу координаты мыши в координаты канваса.
  paddleX = mouseX - paddleWidth / 2; // Центрируем платформу под курсором.

  // Проверки выхода за края канваса.
  if (paddleX < 0) paddleX = 0;
  if (paddleX + paddleWidth > canvas.width) paddleX = canvas.width - paddleWidth;
});

/*------------------------------------- Кирпичики -------------------------*/

let brickRowCount = 4; // Ряды кирпичиков.
let brickColumnCount = 5; // Столбцы кирпичиков.

let brickWidth = 80;   // Ширина кирпичика.
let brickHeight = 25; // Высота кирпичика.

let brickPadding = 15;  // Отступы кирпичиков.
let brickOffsetTop = 50;  // Расстояние от верхнего края.
let brickOffsetLeft; // Расстояние от левого края.

let brickColor = 'rgba(213, 68, 0, 0.6)'; // Цвет кирпичика.

let bricks = [];  // Массив кирпичиков.
let bricksLeft = brickRowCount * brickColumnCount;  // Подсчет оставшихся кирпичей.

// Функция обновления массива кирпичиков.
function initBricks() {
  bricks = [];

  for (let i = 0; i < brickColumnCount; i++) {
    bricks[i] = [];

    for (let j = 0; j < brickRowCount; j++) {
      bricks[i][j] = { x: 0, y: 0, status: 1 };
    };
  };

  bricksLeft = brickRowCount * brickColumnCount;
};

let particles = []; // Массив частиц(разрушение кирпичика).
initBricks(); // Функция обновления массива кирпичиков.

// Функция создания кирпичиков.
function drawBricks() {
  const totalWidth = brickColumnCount * brickWidth + (brickColumnCount - 1) * brickPadding;
  brickOffsetLeft = (canvas.width - totalWidth) / 2;

  for (let i = 0; i < brickColumnCount; i++) {
    for (let j = 0; j < brickRowCount; j++) {
      if (bricks[i][j].status === 1) {
        const brickX = i * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = j * (brickHeight + brickPadding) + brickOffsetTop;

        bricks[i][j].x = brickX;
        bricks[i][j].y = brickY;

        ctx.beginPath();  // Рисуем кирпичики.
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = brickColor;
        ctx.fill();
        ctx.closePath();

        ctx.strokeStyle = 'rgb(107, 34, 0)';
        ctx.lineWidth = 1;
        ctx.stroke();
      };
    };
  };
};

let score = 0;  // Переменная счета игры.

function updateScore() {  // Функиция обновления счета игры.
  const scoreOutput = document.querySelector('.score output');  // Получаем счет по селектору.
  scoreOutput.textContent = score;
};

let level = 1; // Переменная уровня игры.

function updateLevel() {  // Функция обновления уровня игры.
  const levelOutput = document.querySelector('.level output');  // Получаем уровень по селектору.
  levelOutput.textContent = level;

  const levelFone = document.querySelector('.level');
  levelFone.style.backgroundColor = 'rgba(220, 187, 0, 0.4)';

  setTimeout(() => {
    levelFone.style.backgroundColor = 'rgba(185, 185, 185, 0.1)';
  }, 1000);
};

// Функция игровой логики(Пересечение мячика с кирпичиком).
function collisionDetection() { 
  for (let i = 0; i < brickColumnCount; i++) {
    for (let j = 0; j < brickRowCount; j++) {
      const b = bricks[i][j];

      if (b.status === 1) {
        if (
          x + ballSize > b.x &&
          x - ballSize < b.x + brickWidth &&
          y + ballSize > b.y &&
          y - ballSize < b.y + brickHeight
        ) {
          dy = -dy; // Скорость мячика.
          b.status = 0;
          bricksLeft--;

          // Функция частиц.
          createParticles(b.x + brickWidth / 2, b.y + brickHeight / 2, 'rgba(213, 68, 0, 0.6)');

          score += 10;
          updateScore();
          brickCrash();

          if (bricksLeft === 0) { // Переход на новый уровень игры.
            setTimeout(() => {
              level += 1;
              updateLevel(); // Функция обновления уровня игры.
              nextLevel();  // Функция проверки уровня игры.
            }, 1000);
          };
        };
      };
    };
  };
};

function nextLevel() {  // Функция проверки уровня игры.
  if(level === 2) {
    brickColumnCount = 8; // Меняем количество колонок кирпичиков.
    brickRowCount = 7; // Меняем количество рядов кирпичиков.
    brickPadding = 8; // Меняем расстояние между кирпичиками.
    brickColor = 'rgba(31, 133, 0, 0.7)'; // Меняем цвет кирпичика.
    initBricks(); // Функция обновления массива кирпичиков.
    // Сохраняем score и level, восстанавливаем только кирпичи и мяч.
    bricksLeft = brickRowCount * brickColumnCount;

    x = canvas.width / 2;
    y = canvas.height / 2;

    dx = 3 + level * 0.5; // Немного ускоряем с каждым уровнем.
    dy = 3 + level * 0.5; // Движение вниз (к платформе).

    paddleX = canvas.width / 2 - paddleWidth / 2;

    for (let i = 0; i < brickColumnCount; i++) {
      for (let j = 0; j < brickRowCount; j++) {
        bricks[i][j].status = 1;
      };
    };

    isBallActive = true; // Состояние мячика.
    isGameStarted = true;  // Состояние игры.
    //isNextLevel = true; // Состояние уровня.
  } else if(level === 3) {  // Игра пройдена полностью.
    brickColumnCount = 9; // Меняем количество колонок кирпичиков.
    brickRowCount = 8; // Меняем количество рядов кирпичиков.
    brickPadding = 4; // Меняем расстояние между кирпичиками.
    brickColor = 'rgba(255, 30, 124, 0.6)'; // Меняем цвет кирпичика.
    initBricks(); // Функция обновления массива кирпичиков.
    // Сохраняем score и level, восстанавливаем только кирпичи и мяч.
    bricksLeft = brickRowCount * brickColumnCount;

    x = canvas.width / 2;
    y = canvas.height / 2;
    
    dx = 3 + level * 0.5; // Немного ускоряем с каждым уровнем.
    dy = 3 + level * 0.5; // Движение вниз (к платформе).

    paddleX = canvas.width / 2 - paddleWidth / 2;

    for (let i = 0; i < brickColumnCount; i++) {
      for (let j = 0; j < brickRowCount; j++) {
        bricks[i][j].status = 1;
      };
    };

    isBallActive = true; // Состояние мячика.
    isGameStarted = true;  // Состояние игры.
    isNextLevel = true; // Состояние уровня.
  } else if(level > 3) {
    resetGame(); // Функция сброса игры.

    const textStartGame = document.querySelector('.startGame p'); // Получяем текст кнопки по селектору.
    textStartGame.textContent = 'End Game'; // Меняем текст кнопки.

    startGame.style.display = 'inline-flex';  // Возвращаем кнопку на экран.
    startGame.style.opacity = 1;
  };
};

function createParticles(x, y, color) {
  for (let i = 0; i < 10; i++) {
    particles.push({
      x: x,
      y: y,
      dx: (Math.random() - 0.5) * 6,
      dy: (Math.random() - 0.5) * 6,
      size: Math.random() * 4 + 2,
      life: 30,
      color: color
    });
  };
};

function drawParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];

    ctx.fillStyle = `rgba(213, 68, 0, ${p.life / 30})`;
    ctx.fillRect(p.x, p.y, p.size, p.size);

    p.x += p.dx;
    p.y += p.dy;
    p.dy += 0.1;
    p.life--;

    if (p.life <= 0) {
      particles.splice(i, 1);
    };
  };
};

/*---------------------------- Звуки ----------------------------------*/
let vol = 50; // Переменная громкости звука.

function brickCrash() {
  let audio = new Audio();
  audio.src = "../sounds/brick.mp3";
  audio.autoplay = true;
  audio.volume = (vol / 100);
};

function hitRocket() {
  let audio = new Audio();
  audio.src = "../sounds/hitRocket.mp3";
  audio.autoplay = true;
  audio.volume = (vol / 100);
};

function hitWall() {
  let audio = new Audio();
  audio.src = "../sounds/hitWall.mp3";
  audio.autoplay = true;
  audio.volume = (vol / 100);
};

function fellWater() {
  let audio = new Audio();
  audio.src = "../sounds/fellWater.mp3";
  audio.autoplay = true;
  audio.volume = (vol / 100);
};

function clickButton() {
  let audio = new Audio();
  audio.src = "../sounds/startGame.mp3";
  audio.autoplay = true;
  audio.volume = (vol / 100);
};

})();
