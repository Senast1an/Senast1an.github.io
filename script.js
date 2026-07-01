const board = document.getElementById('board');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const message = document.getElementById('message');
const levelEl = document.getElementById('level');
const scoreEl = document.getElementById('score');
const bestEl = document.getElementById('best');
const showTimeEl = document.getElementById('showTime');

let level = 1;
let score = 0;
let best = Number(localStorage.getItem('memoriaNumericaBest')) || 0;
let expectedNumber = 1;
let tiles = [];
let acceptingClicks = false;

bestEl.textContent = best;

function numbersForLevel() {
  return Math.min(4 + level, 10);
}

function visibleTime() {
  return Math.max(1000, 2200 - level * 100);
}

function updateStats() {
  levelEl.textContent = level;
  scoreEl.textContent = score;
  bestEl.textContent = best;
  showTimeEl.textContent = (visibleTime() / 1000).toFixed(1) + 's';
}

function setMessage(text, type = '') {
  message.textContent = text;
  message.className = 'message ' + type;
}

function randomPosition(size = 62, padding = 14) {
  const rect = board.getBoundingClientRect();
  return {
    x: Math.random() * (rect.width - size - padding * 2) + padding,
    y: Math.random() * (rect.height - size - padding * 2) + padding
  };
}

function isFarEnough(pos, positions, minDistance = 78) {
  return positions.every(other => {
    const dx = pos.x - other.x;
    const dy = pos.y - other.y;
    return Math.sqrt(dx * dx + dy * dy) >= minDistance;
  });
}

function createTiles() {
  board.innerHTML = '';
  tiles = [];
  const total = numbersForLevel();
  const positions = [];

  for (let number = 1; number <= total; number++) {
    let pos;
    let attempts = 0;
    do {
      pos = randomPosition();
      attempts++;
    } while (!isFarEnough(pos, positions) && attempts < 300);

    positions.push(pos);

    const tile = document.createElement('button');
    tile.className = 'tile';
    tile.textContent = number;
    tile.dataset.number = number;
    tile.style.left = pos.x + 'px';
    tile.style.top = pos.y + 'px';
    tile.addEventListener('click', handleTileClick);
    board.appendChild(tile);
    tiles.push(tile);
  }
}

function startRound() {
  acceptingClicks = false;
  expectedNumber = 1;
  updateStats();
  createTiles();
  startBtn.disabled = true;
  setMessage(`Memoriza ${numbersForLevel()} números. Luego presiona los cuadros en orden.`, 'warn');

  setTimeout(() => {
    tiles.forEach(tile => tile.classList.add('hidden-number'));
    acceptingClicks = true;
    setMessage(`Ahora selecciona el número ${expectedNumber}.`);
  }, visibleTime());
}

function handleTileClick(event) {
  if (!acceptingClicks) return;

  const tile = event.currentTarget;
  const number = Number(tile.dataset.number);

  if (number === expectedNumber) {
    tile.classList.remove('hidden-number');
    tile.classList.add('correct');
    expectedNumber++;
    score += 10;

    if (expectedNumber > numbersForLevel()) {
      acceptingClicks = false;
      level++;
      score += 25;
      best = Math.max(best, score);
      localStorage.setItem('memoriaNumericaBest', best);
      updateStats();
      setMessage('¡Correcto! Pasas al siguiente nivel.', 'success');
      setTimeout(startRound, 1000);
    } else {
      updateStats();
      setMessage(`Bien. Ahora busca el número ${expectedNumber}.`, 'success');
    }
  } else {
    acceptingClicks = false;
    tile.classList.remove('hidden-number');
    tile.classList.add('wrong');
    revealAll();
    best = Math.max(best, score);
    localStorage.setItem('memoriaNumericaBest', best);
    updateStats();
    startBtn.disabled = false;
    setMessage(`Fallaste. Tocaste ${number}, pero correspondía ${expectedNumber}. Puedes intentarlo otra vez.`, 'error');
  }
}

function revealAll() {
  tiles.forEach(tile => tile.classList.remove('hidden-number'));
}

function resetGame() {
  level = 1;
  score = 0;
  expectedNumber = 1;
  acceptingClicks = false;
  board.innerHTML = '';
  startBtn.disabled = false;
  updateStats();
  setMessage('Juego reiniciado. Presiona “Iniciar juego” para comenzar.');
}

startBtn.addEventListener('click', startRound);
resetBtn.addEventListener('click', resetGame);
updateStats();
