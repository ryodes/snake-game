let frame = 0;
let lastFrame = null;
let score = 0;
let buffer = [];
let hide = false;
let identificateurTime;
let chrono = 10;

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const box = 20;
let snake = [{ x: 9 * box, y: 10 * box }];
let direction = null;

let food = {
  x: Math.floor(Math.random() * 20) * box,
  y: Math.floor(Math.random() * 20) * box,
};

let nextFood = {
  x: Math.floor(Math.random() * 20) * box,
  y: Math.floor(Math.random() * 20) * box,
};

document.addEventListener("keydown", (e) => changeDirection(e, frame));

let snakeX = snake[0].x;
let snakeY = snake[0].y;

function changeDirection(e, frameParam) {
  const input = e.key;
  if (frameParam == lastFrame) {
    buffer.push(input);
    return;
  }
  if (input === "ArrowUp" && direction !== "DOWN") {
    direction = "UP";
    lastFrame = frame;
  } else if (input === "ArrowDown" && direction !== "UP") {
    direction = "DOWN";
    lastFrame = frame;
  } else if (input === "ArrowLeft" && direction !== "RIGHT") {
    direction = "LEFT";
    lastFrame = frame;
  } else if (input === "ArrowRight" && direction !== "LEFT") {
    direction = "RIGHT";
    lastFrame = frame;
  }
}

function cleanBuffer() {
  const input = buffer.shift();
  if (input === "ArrowUp" && direction !== "DOWN") {
    direction = "UP";
    lastFrame = frame;
  } else if (input === "ArrowDown" && direction !== "UP") {
    direction = "DOWN";
    lastFrame = frame;
  } else if (input === "ArrowLeft" && direction !== "RIGHT") {
    direction = "LEFT";
    lastFrame = frame;
  } else if (input === "ArrowRight" && direction !== "LEFT") {
    direction = "RIGHT";
    lastFrame = frame;
  }
}

function draw() {
  if (buffer.length > 0 && frame != lastFrame) {
    cleanBuffer();
  }
  frame++;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // --- Affichage du score ---
  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  ctx.fillText("Score: " + score * 10, 10, 20);

  // --- Affichage du chrono ---
  ctx.fillStyle = "yellow";
  ctx.font = "16px Arial";
  ctx.fillText("⏱ Temps: " + chrono + "s", 300, 20);

  // --- Affichage de la pomme ---
  if (!hide) {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);
  }

  ctx.fillStyle = "rgb(255 0 0 / 35%)";
  ctx.fillRect(nextFood.x, nextFood.y, box, box);

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "lime" : "green";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  if (direction === "UP") snakeY -= box;
  if (direction === "DOWN") snakeY += box;
  if (direction === "LEFT") snakeX -= box;
  if (direction === "RIGHT") snakeX += box;

  if (snakeX === food.x && snakeY === food.y) {
    score += 1;
    hide = false;
    clearTimeout(identificateurTime);
    chrono = 10;
    food = nextFood;
    nextFood = {
      x: Math.floor(Math.random() * 20) * box,
      y: Math.floor(Math.random() * 20) * box,
    };
    if (score > 20) {
      identificateurTime = setTimeout(() => {
        hide = true;
      }, 800);
    } else if (score > 10) {
      identificateurTime = setTimeout(() => {
        hide = true;
      }, 1500);
    }
  } else {
    snake.pop();
  }

  const newHead = { x: snakeX, y: snakeY };

  if (
    snakeX < 0 ||
    snakeY < 0 ||
    snakeX >= canvas.width ||
    snakeY >= canvas.height ||
    snake.some((part) => part.x === newHead.x && part.y === newHead.y)
  ) {
    gameOver();
    return;
  }

  snake.unshift(newHead);
  let speed = Math.max(50, 200 * (1 - Math.log(score + 10) / 5));
  setTimeout(draw, speed);
}

// --- Décrémentation du chrono ---
let chronoInterval = setInterval(() => {
  if (!direction) return;
  chrono--;
  if (chrono <= 0) {
    gameOver();
  }
}, 1000);

// --- Fin de jeu ---
function gameOver() {
  clearInterval(chronoInterval);
  if (confirm("Game Over ! Score: " + score * 10)) {
    window.location.reload();
  }
}

// démarrage du jeu
draw();
