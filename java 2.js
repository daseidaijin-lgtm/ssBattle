const cells = document.querySelectorAll(".cell");
const turnText = document.getElementById("turnText");
const startBtn = document.getElementById("startBtn");
const levelSelect = document.getElementById("level");

let board = ["", "", "", "", "", "", "", "", ""];
let player = "〇";
let cpu = "×";
let currentTurn = "";
let gameOver = false;

const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

startBtn.addEventListener("click", startGame);

cells.forEach((cell, index) => {
  cell.addEventListener("click", () => {
    if (gameOver || currentTurn !== player || board[index] !== "") return;

    board[index] = player;
    cell.textContent = player;

    if (checkEnd()) return;

    currentTurn = cpu;
    turnText.textContent = "CPUの番です";

    setTimeout(cpuMove, 500);
  });
});

function startGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  gameOver = false;

  cells.forEach(cell => {
    cell.textContent = "";
    cell.style.background = "white";
  });

  if (Math.random() < 0.5) {
    currentTurn = player;
    turnText.textContent = "あなたが先攻です";
  } else {
    currentTurn = cpu;
    turnText.textContent = "CPUが先攻です";
    setTimeout(cpuMove, 500);
  }
}

function cpuMove() {
  if (gameOver) return;

  const level = levelSelect.value;
  let move;

  if (level === "easy") {
    move = randomMove();
  } else if (level === "normal") {
    move = normalMove();
  } else {
    move = bestMove();
  }

  board[move] = cpu;
  cells[move].textContent = cpu;

  if (checkEnd()) return;

  currentTurn = player;
  turnText.textContent = "あなたの番です";
}

function randomMove() {
  const empty = getEmptyCells();
  return empty[Math.floor(Math.random() * empty.length)];
}

function normalMove() {
  if (Math.random() < 0.5) {
    return bestMove();
  } else {
    return randomMove();
  }
}

function bestMove() {
  let bestScore = -Infinity;
  let move;

  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = cpu;
      let score = minimax(board, false);
      board[i] = "";

      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  return move;
}

function minimax(board, isMaximizing) {
  const winner = getWinner();

  if (winner === cpu) return 10;
  if (winner === player) return -10;
  if (getEmptyCells().length === 0) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;

    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = cpu;
        let score = minimax(board, false);
        board[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }

    return bestScore;
  } else {
    let bestScore = Infinity;

    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = player;
        let score = minimax(board, true);
        board[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }

    return bestScore;
  }
}

function getEmptyCells() {
  return board
    .map((value, index) => value === "" ? index : null)
    .filter(value => value !== null);
}

function getWinner() {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;

    if (
      board[a] !== "" &&
      board[a] === board[b] &&
      board[b] === board[c]
    ) {
      return board[a];
    }
  }

  return null;
}

function checkEnd() {
  const winner = getWinner();

  if (winner) {
    gameOver = true;

    if (winner === player) {
      turnText.textContent = "あなたの勝ちです！";
    } else {
      turnText.textContent = "CPUの勝ちです！";
    }

    highlightWinner();
    return true;
  }

  if (getEmptyCells().length === 0) {
    gameOver = true;
    turnText.textContent = "引き分けです";
    return true;
  }

  return false;
}

function highlightWinner() {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;

    if (
      board[a] !== "" &&
      board[a] === board[b] &&
      board[b] === board[c]
    ) {
      cells[a].style.background = "#ffff66";
      cells[b].style.background = "#ffff66";
      cells[c].style.background = "#ffff66";
    }
  }
}