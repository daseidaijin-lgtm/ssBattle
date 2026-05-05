const universities = [
  { name: "東京大学", deviation: 72.5, rank: "S" },
  { name: "京都大学", deviation: 70.0, rank: "S" },
  { name: "一橋大学", deviation: 67.5, rank: "S" },
  { name: "東京工業大学", deviation: 67.5, rank: "S" },
  { name: "大阪大学", deviation: 67.5, rank: "A" },
  { name: "早稲田大学", deviation: 67.5, rank: "A" },
  { name: "慶應義塾大学", deviation: 67.5, rank: "A" },
  { name: "東北大学", deviation: 65.0, rank: "A" },
  { name: "名古屋大学", deviation: 65.0, rank: "A" },
  { name: "北海道大学", deviation: 62.5, rank: "A" },
  { name: "九州大学", deviation: 62.5, rank: "A" },
  { name: "筑波大学", deviation: 62.5, rank: "B" },
  { name: "神戸大学", deviation: 62.5, rank: "B" },
  { name: "上智大学", deviation: 62.5, rank: "B" },
  { name: "横浜国立大学", deviation: 60.0, rank: "B" },
  { name: "東京理科大学", deviation: 60.0, rank: "B" },
  { name: "明治大学", deviation: 60.0, rank: "B" },
  { name: "青山学院大学", deviation: 60.0, rank: "B" },
  { name: "立教大学", deviation: 60.0, rank: "B" },
  { name: "同志社大学", deviation: 60.0, rank: "B" },
  { name: "中央大学", deviation: 57.5, rank: "C" },
  { name: "法政大学", deviation: 57.5, rank: "C" },
  { name: "千葉大学", deviation: 57.5, rank: "C" },
  { name: "広島大学", deviation: 57.5, rank: "C" },
  { name: "岡山大学", deviation: 55.0, rank: "C" },
  { name: "関西大学", deviation: 55.0, rank: "C" },
  { name: "関西学院大学", deviation: 55.0, rank: "C" },
  { name: "立命館大学", deviation: 55.0, rank: "C" },
  { name: "日本大学", deviation: 50.0, rank: "D" },
  { name: "東洋大学", deviation: 50.0, rank: "D" },
  { name: "駒澤大学", deviation: 50.0, rank: "D" },
  { name: "専修大学", deviation: 50.0, rank: "D" },
  { name: "神奈川大学", deviation: 47.5, rank: "D" },
  { name: "国士舘大学", deviation: 45.0, rank: "D" },
  { name: "帝京大学", deviation: 45.0, rank: "D" },
  { name: "東海大学", deviation: 45.0, rank: "D" },
  { name: "大東文化大学", deviation: 45.0, rank: "D" },
  { name: "亜細亜大学", deviation: 42.5, rank: "E" },
  { name: "拓殖大学", deviation: 42.5, rank: "E" },
  { name: "関東学院大学", deviation: 40.0, rank: "E" },
  { name: "流通経済大学", deviation: 37.5, rank: "E" },
  { name: "桜美林大学", deviation: 37.5, rank: "E" },
  { name: "白鷗大学", deviation: 37.5, rank: "E" },
  { name: "城西大学", deviation: 37.5, rank: "E" },
  { name: "明星大学", deviation: 35.0, rank: "E" }
];

const maxTurn = 5;

let turn = 1;
let playerScore = 0;
let cpuScore = 0;
let gameOver = false;

const turnText = document.getElementById("turnText");
const playerScoreText = document.getElementById("playerScore");
const cpuScoreText = document.getElementById("cpuScore");

const playerUniversity = document.getElementById("playerUniversity");
const playerRank = document.getElementById("playerRank");
const playerDeviation = document.getElementById("playerDeviation");

const cpuUniversity = document.getElementById("cpuUniversity");
const cpuRank = document.getElementById("cpuRank");
const cpuDeviation = document.getElementById("cpuDeviation");

const resultText = document.getElementById("resultText");
const battleBtn = document.getElementById("battleBtn");
const resetBtn = document.getElementById("resetBtn");

battleBtn.addEventListener("click", battle);
resetBtn.addEventListener("click", resetGame);

function battle() {
  if (gameOver) return;

  const playerCard = getRandomUniversity();
  const cpuCard = getRandomUniversity();

  showCard(playerCard, "player");
  showCard(cpuCard, "cpu");

  if (playerCard.deviation > cpuCard.deviation) {
    playerScore++;
    resultText.textContent = "あなたの勝ち！";
  } else if (playerCard.deviation < cpuCard.deviation) {
    cpuScore++;
    resultText.textContent = "CPUの勝ち！";
  } else {
    resultText.textContent = "引き分け！";
  }

  updateScore();

  if (turn >= maxTurn) {
    finishGame();
  } else {
    turn++;
    turnText.textContent = `ターン：${turn} / ${maxTurn}`;
  }
}

function getRandomUniversity() {
  const randomIndex = Math.floor(Math.random() * universities.length);
  return universities[randomIndex];
}

function showCard(card, side) {
  if (side === "player") {
    playerUniversity.textContent = card.name;
    playerRank.textContent = `ランク：${card.rank}`;
    playerDeviation.textContent = `偏差値：${card.deviation}`;
  } else {
    cpuUniversity.textContent = card.name;
    cpuRank.textContent = `ランク：${card.rank}`;
    cpuDeviation.textContent = `偏差値：${card.deviation}`;
  }
}

function updateScore() {
  playerScoreText.textContent = playerScore;
  cpuScoreText.textContent = cpuScore;
}

function finishGame() {
  gameOver = true;
  battleBtn.disabled = true;

  if (playerScore > cpuScore) {
    resultText.textContent = `最終結果：あなたの勝利！ ${playerScore} - ${cpuScore}`;
  } else if (playerScore < cpuScore) {
    resultText.textContent = `最終結果：CPUの勝利！ ${playerScore} - ${cpuScore}`;
  } else {
    resultText.textContent = `最終結果：引き分け！ ${playerScore} - ${cpuScore}`;
  }
}

function resetGame() {
  turn = 1;
  playerScore = 0;
  cpuScore = 0;
  gameOver = false;

  turnText.textContent = `ターン：${turn} / ${maxTurn}`;
  playerScoreText.textContent = playerScore;
  cpuScoreText.textContent = cpuScore;

  playerUniversity.textContent = "？？？";
  playerRank.textContent = "ランク：-";
  playerDeviation.textContent = "偏差値：-";

  cpuUniversity.textContent = "？？？";
  cpuRank.textContent = "ランク：-";
  cpuDeviation.textContent = "偏差値：-";

  resultText.textContent = "カードを出して勝負！";
  battleBtn.disabled = false;
}
