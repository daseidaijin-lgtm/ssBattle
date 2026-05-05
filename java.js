//（長いので重要部分だけ抜粋じゃなく全部書いてある）

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
const playerText = document.getElementById("playerText");
const cpuText = document.getElementById("cpuText");

const playerName = document.getElementById("playerName");
const playerPower = document.getElementById("playerPower");
const cpuName = document.getElementById("cpuName");
const cpuPower = document.getElementById("cpuPower");

const result = document.getElementById("result");
const handArea = document.getElementById("hand");
const resetBtn = document.getElementById("resetBtn");
const cpuLevelSelect = document.getElementById("cpuLevel");
const damageContainer = document.getElementById("damageContainer");

resetBtn.addEventListener("click", startGame);

startGame();

function randomCard() {
  const list = [
    { name: "東京大学", power: 72.5 },
    { name: "京都大学", power: 70 },
    { name: "早稲田大学", power: 67.5 },
    { name: "慶應義塾大学", power: 67.5 },
    { name: "大阪大学", power: 67.5 },
    { name: "明治大学", power: 60 },
    { name: "中央大学", power: 57.5 },
    { name: "日本大学", power: 50 },
    { name: "帝京大学", power: 45 },
    { name: "明星大学", power: 35 }
  ];
  return list[Math.floor(Math.random() * list.length)];
}

function getLabel(power) {
  if (power >= 70) return "旧帝大";
  if (power >= 65) return "国公立理系";
  if (power >= 60) return "国公立";
  if (power >= 52.5) return "中堅";
  if (power >= 45) return "私文";
  return "Fラン";
}

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

  updatePP();
  showHand();
}

function showHand() {
  handArea.innerHTML = "";
  playerHand.forEach((card, i) => {
    const div = document.createElement("div");
    div.className = "hand-card";
    div.innerHTML = `<h3>${card.name}</h3><p>${getLabel(card.power)}</p>`;
    div.onclick = () => playTurn(i);
    handArea.appendChild(div);
  });
}

function playTurn(i) {
  if (gameOver) return;

  const playerCard = playerHand[i];
  const cpuCard = cpuHand[Math.floor(Math.random() * cpuHand.length)];

  playerName.textContent = playerCard.name;
  playerPower.textContent = getLabel(playerCard.power);
  cpuName.textContent = cpuCard.name;
  cpuPower.textContent = getLabel(cpuCard.power);

  let damage = 0;

  if (playerCard.power > cpuCard.power) {
    damage = (playerCard.power - cpuCard.power) * 100;
    cpuPP -= damage;

    const rect = cpuName.getBoundingClientRect();
    showDamage(rect.left, rect.top, damage);
    shakeElement(document.querySelectorAll(".field-card")[1]);

  } else if (playerCard.power < cpuCard.power) {
    damage = (cpuCard.power - playerCard.power) * 100;
    playerPP -= damage;

    const rect = playerName.getBoundingClientRect();
    showDamage(rect.left, rect.top, damage);
    shakeElement(document.querySelectorAll(".field-card")[0]);
  }

  updatePP();
}

function updatePP() {
  playerPP = Math.max(0, playerPP);
  cpuPP = Math.max(0, cpuPP);

  playerPPText.textContent = playerPP;
  cpuPPText.textContent = cpuPP;

  const pr = playerPP / maxPP;
  const cr = cpuPP / maxPP;

  playerBar.style.width = `${pr * 100}%`;
  cpuBar.style.width = `${cr * 100}%`;

  playerText.textContent = `${playerPP} / ${maxPP}`;
  cpuText.textContent = `${cpuPP} / ${maxPP}`;

  setHPColor(playerBar, pr);
  setHPColor(cpuBar, cr);
}

function setHPColor(bar, ratio) {
  if (ratio > 0.6) {
    bar.style.background = "green";
  } else if (ratio > 0.3) {
    bar.style.background = "yellow";
  } else {
    bar.style.background = "red";
  }
}

function showDamage(x, y, damage) {
  const div = document.createElement("div");
  div.className = "damage";
  div.textContent = "-" + Math.floor(damage);
  div.style.left = x + "px";
  div.style.top = y + "px";
  damageContainer.appendChild(div);
  setTimeout(() => div.remove(), 800);
}

function shakeElement(el) {
  el.classList.add("shake");
  setTimeout(() => el.classList.remove("shake"), 350);
}
