const universities = [
  { name: "東京大学", power: 72.5 },
  { name: "京都大学", power: 70 },
  { name: "一橋大学", power: 67.5 },
  { name: "東京工業大学", power: 67.5 },
  { name: "大阪大学", power: 67.5 },
  { name: "早稲田大学", power: 67.5 },
  { name: "慶應義塾大学", power: 67.5 },
  { name: "東北大学", power: 65 },
  { name: "名古屋大学", power: 65 },
  { name: "北海道大学", power: 62.5 },
  { name: "九州大学", power: 62.5 },
  { name: "筑波大学", power: 62.5 },
  { name: "神戸大学", power: 62.5 },
  { name: "上智大学", power: 62.5 },
  { name: "横浜国立大学", power: 60 },
  { name: "明治大学", power: 60 },
  { name: "青山学院大学", power: 60 },
  { name: "立教大学", power: 60 },
  { name: "中央大学", power: 57.5 },
  { name: "法政大学", power: 57.5 },
  { name: "日本大学", power: 50 },
  { name: "東洋大学", power: 50 },
  { name: "駒澤大学", power: 50 },
  { name: "専修大学", power: 50 },
  { name: "帝京大学", power: 45 },
  { name: "東海大学", power: 45 },
  { name: "亜細亜大学", power: 42.5 },
  { name: "関東学院大学", power: 40 },
  { name: "明星大学", power: 35 }
];

const maxPP = 4000;

let playerPP = maxPP;
let cpuPP = maxPP;
let playerHand = [];
let cpuHand = [];
let gameOver = false;

const playerPPText = document.getElementById("playerPP");
const cpuPPText = document.getElementById("cpuPP");
const playerBar = document.getElementById("playerBar");
const cpuBar = document.getElementById("cpuBar");

const playerName = document.getElementById("playerName");
const playerPower = document.getElementById("playerPower");
const cpuName = document.getElementById("cpuName");
const cpuPower = document.getElementById("cpuPower");

const result = document.getElementById("result");
const handArea = document.getElementById("hand");
const resetBtn = document.getElementById("resetBtn");
const cpuLevelSelect = document.getElementById("cpuLevel");

resetBtn.addEventListener("click", startGame);

startGame();

function startGame() {
  playerPP = maxPP;
  cpuPP = maxPP;
  gameOver = false;

  playerHand = [];
  cpuHand = [];

  for (let i = 0; i < 5; i++) {
    playerHand.push(randomCard());
    cpuHand.push(randomCard());
  }

  playerName.textContent = "？？？";
  playerPower.textContent = "-";
  cpuName.textContent = "？？？";
  cpuPower.textContent = "-";

  result.textContent = "手札からカードを選べ！";

  updatePP();
  showHand();
}

function randomCard() {
  return universities[Math.floor(Math.random() * universities.length)];
}

function getLabel(power) {
  if (power >= 70) return "旧帝大";
  if (power >= 65) return "国公立理系";
  if (power >= 60) return "国公立";
  if (power >= 52.5) return "中堅";
  if (power >= 45) return "私文";
  return "Fラン";
}

function showHand() {
  handArea.innerHTML = "";

  playerHand.forEach((card, index) => {
    const div = document.createElement("div");
    div.className = "hand-card";

    div.innerHTML = `
      <h3>${card.name}</h3>
      <p>${getLabel(card.power)}</p>
    `;

    div.addEventListener("click", () => playTurn(index));
    handArea.appendChild(div);
  });
}

function playTurn(playerIndex) {
  if (gameOver) return;

  const playerCard = playerHand[playerIndex];
  const cpuIndex = chooseCpuCard(playerCard);
  const cpuCard = cpuHand[cpuIndex];

  playerHand.splice(playerIndex, 1);
  cpuHand.splice(cpuIndex, 1);

  playerHand.push(randomCard());
  cpuHand.push(randomCard());

  playerName.textContent = playerCard.name;
  playerPower.textContent = getLabel(playerCard.power);

  cpuName.textContent = cpuCard.name;
  cpuPower.textContent = getLabel(cpuCard.power);

  if (playerCard.power > cpuCard.power) {
    const damage = Math.floor((playerCard.power - cpuCard.power) * 100);
    cpuPP -= damage;
    result.textContent = `あなたの勝ち！ CPUに${damage}ダメージ`;
  } else if (playerCard.power < cpuCard.power) {
    const damage = Math.floor((cpuCard.power - playerCard.power) * 100);
    playerPP -= damage;
    result.textContent = `CPUの勝ち！ あなたに${damage}ダメージ`;
  } else {
    result.textContent = "引き分け！";
  }

  updatePP();
  checkGameOver();
  showHand();
}

function chooseCpuCard(playerCard) {
  const level = cpuLevelSelect.value;

  if (level === "easy") {
    return randomCpuIndex();
  }

  if (level === "normal") {
    if (Math.random() < 0.5) {
      return saveStrongCardAI(playerCard);
    }
    return randomCpuIndex();
  }

  if (level === "hard") {
    return saveStrongCardAI(playerCard);
  }
}

// 強カード温存AI
function saveStrongCardAI(playerCard) {
  let winningIndexes = [];

  for (let i = 0; i < cpuHand.length; i++) {
    if (cpuHand[i].power > playerCard.power) {
      winningIndexes.push(i);
    }
  }

  // 勝てるカードがあるなら「ギリギリ勝てる一番弱いカード」を出す
  if (winningIndexes.length > 0) {
    let bestIndex = winningIndexes[0];

    for (let index of winningIndexes) {
      if (cpuHand[index].power < cpuHand[bestIndex].power) {
        bestIndex = index;
      }
    }

    return bestIndex;
  }

  // 勝てないなら一番弱いカードを捨てる
  let weakestIndex = 0;

  for (let i = 1; i < cpuHand.length; i++) {
    if (cpuHand[i].power < cpuHand[weakestIndex].power) {
      weakestIndex = i;
    }
  }

  return weakestIndex;
}

function randomCpuIndex() {
  return Math.floor(Math.random() * cpuHand.length);
}

function updatePP() {
  playerPP = Math.max(0, playerPP);
  cpuPP = Math.max(0, cpuPP);

  playerPPText.textContent = playerPP;
  cpuPPText.textContent = cpuPP;

  playerBar.style.width = `${(playerPP / maxPP) * 100}%`;
  cpuBar.style.width = `${(cpuPP / maxPP) * 100}%`;
}

function checkGameOver() {
  if (playerPP <= 0) {
    result.textContent = "あなたの敗北…CPUの勝ち！";
    gameOver = true;
  } else if (cpuPP <= 0) {
    result.textContent = "あなたの勝利！";
    gameOver = true;
  }
}
