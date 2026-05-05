const maxPP = 4000;

const deck = [
  { type: "university", name: "東京大学", power: 72.5 },
  { type: "university", name: "京都大学", power: 70 },
  { type: "university", name: "一橋大学", power: 67.5 },
  { type: "university", name: "東京工業大学", power: 67.5 },
  { type: "university", name: "大阪大学", power: 67.5 },
  { type: "university", name: "早稲田大学", power: 67.5 },
  { type: "university", name: "慶應義塾大学", power: 67.5 },
  { type: "university", name: "東北大学", power: 65 },
  { type: "university", name: "名古屋大学", power: 65 },
  { type: "university", name: "北海道大学", power: 62.5 },
  { type: "university", name: "九州大学", power: 62.5 },
  { type: "university", name: "筑波大学", power: 62.5 },
  { type: "university", name: "神戸大学", power: 62.5 },
  { type: "university", name: "上智大学", power: 62.5 },
  { type: "university", name: "横浜国立大学", power: 60 },
  { type: "university", name: "明治大学", power: 60 },
  { type: "university", name: "青山学院大学", power: 60 },
  { type: "university", name: "立教大学", power: 60 },
  { type: "university", name: "中央大学", power: 57.5 },
  { type: "university", name: "法政大学", power: 57.5 },
  { type: "university", name: "日本大学", power: 50 },
  { type: "university", name: "東洋大学", power: 50 },
  { type: "university", name: "駒澤大学", power: 50 },
  { type: "university", name: "専修大学", power: 50 },
  { type: "university", name: "帝京大学", power: 45 },
  { type: "university", name: "東海大学", power: 45 },
  { type: "university", name: "亜細亜大学", power: 42.5 },
  { type: "university", name: "関東学院大学", power: 40 },
  { type: "university", name: "明星大学", power: 35 },

  { type: "event", name: "成り上がり社長", effect: "rise" },
  { type: "event", name: "炎上覚悟の逆転劇", effect: "flame" },
  { type: "event", name: "登録者100万人", effect: "heal" },
  { type: "event", name: "一発逆転のバズ", effect: "buzz" }
];

let playerPP = maxPP;
let cpuPP = maxPP;

let playerHand = [];
let cpuHand = [];

let playerEvent = null;
let cpuEvent = null;

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

const playerLine = document.getElementById("playerLine");
const cpuLine = document.getElementById("cpuLine");

resetBtn.addEventListener("click", startGame);

startGame();

function startGame() {
  playerPP = maxPP;
  cpuPP = maxPP;
  gameOver = false;

  playerHand = [];
  cpuHand = [];
  playerEvent = null;
  cpuEvent = null;

  for (let i = 0; i < 5; i++) {
    playerHand.push(randomCard());
    cpuHand.push(randomCard());
  }

  playerName.textContent = "？？？";
  playerPower.textContent = "-";
  cpuName.textContent = "？？？";
  cpuPower.textContent = "-";

  playerLine.textContent = "いくぞ、学歴バトル開始！";
  cpuLine.textContent = "これは読み合いやな。";
  result.textContent = "手札からカードを選べ！";

  updatePP();
  showHand();
}

function randomCard() {
  return deck[Math.floor(Math.random() * deck.length)];
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

  playerHand.forEach((card, i) => {
    const div = document.createElement("div");

    if (card.type === "event") {
      div.className = "hand-card event-card";
      div.innerHTML = `
        <h3>${card.name}</h3>
        <p>イベントカード</p>
      `;
    } else {
      const label = getLabel(card.power);
      div.className = `hand-card card-${label}`;
      div.innerHTML = `
        <h3>${card.name}</h3>
        <p>${label}</p>
      `;
    }

    div.onclick = () => playCard(i);
    handArea.appendChild(div);
  });
}

function playCard(i) {
  if (gameOver) return;

  const card = playerHand[i];

  if (card.type === "event") {
    playerEvent = card;
    playerHand.splice(i, 1);
    playerHand.push(randomCard());

    result.textContent = `イベント「${card.name}」をセット！ 次の大学カードで発動！`;
    playerLine.textContent = `ここで「${card.name}」や！`;
    showHand();
    return;
  }

  playTurn(i);
}

function playTurn(playerIndex) {
  if (gameOver) return;

  const playerCard = playerHand[playerIndex];

  if (playerCard.type !== "university") {
    result.textContent = "大学カードを選んで！";
    return;
  }

  cpuUseEvent();

  const cpuIndex = chooseCpuUniversityCard(playerCard);
  const cpuCard = cpuHand[cpuIndex];

  let playerPowerValue = playerCard.power;
  let cpuPowerValue = cpuCard.power;

  let messages = [];

  const playerEventResult = applyEvent("player", playerEvent, playerCard, cpuCard);
  playerPowerValue += playerEventResult.playerBonus;
  cpuPowerValue += playerEventResult.cpuBonus;
  messages.push(playerEventResult.message);

  const cpuEventResult = applyEvent("cpu", cpuEvent, cpuCard, playerCard);
  cpuPowerValue += cpuEventResult.playerBonus;
  playerPowerValue += cpuEventResult.cpuBonus;
  messages.push(cpuEventResult.message);

  playerEvent = null;
  cpuEvent = null;

  playerHand.splice(playerIndex, 1);
  cpuHand.splice(cpuIndex, 1);

  playerHand.push(randomCard());
  cpuHand.push(randomCard());

  playerName.textContent = playerCard.name;
  playerPower.textContent = getLabel(playerCard.power);

  cpuName.textContent = cpuCard.name;
  cpuPower.textContent = getLabel(cpuCard.power);

  playerName.parentElement.className = `field-card card-${getLabel(playerCard.power)}`;
  cpuName.parentElement.className = `field-card card-${getLabel(cpuCard.power)}`;

  if (playerPowerValue > cpuPowerValue) {
    const damage = Math.floor((playerPowerValue - cpuPowerValue) * 100);
    cpuPP -= damage;

    const rect = cpuName.getBoundingClientRect();
    showDamage(rect.left + 30, rect.top, damage);
    shakeElement(document.querySelectorAll(".field-card")[1]);

    result.textContent = `${messages.join(" ")} あなたの勝ち！ CPUに${damage}ダメージ！`;
    playerLine.textContent = "学歴マウント成功！";
    cpuLine.textContent = "今のは痛いな……";

  } else if (playerPowerValue < cpuPowerValue) {
    const damage = Math.floor((cpuPowerValue - playerPowerValue) * 100);
    playerPP -= damage;

    const rect = playerName.getBoundingClientRect();
    showDamage(rect.left + 30, rect.top, damage);
    shakeElement(document.querySelectorAll(".field-card")[0]);

    result.textContent = `${messages.join(" ")} CPUの勝ち！ あなたに${damage}ダメージ！`;
    playerLine.textContent = "くっ、まだ終わってない！";
    cpuLine.textContent = "読み勝ちやな。";

  } else {
    result.textContent = `${messages.join(" ")} 引き分け！`;
    playerLine.textContent = "互角か……";
    cpuLine.textContent = "ええ勝負や。";
  }

  updatePP();
  checkGameOver();
  showHand();
}

function applyEvent(owner, eventCard, ownUniversity, enemyUniversity) {
  const noEffect = {
    playerBonus: 0,
    cpuBonus: 0,
    message: ""
  };

  if (!eventCard) return noEffect;

  const isF = getLabel(ownUniversity.power) === "Fラン";
  let message = "";

  if (eventCard.effect === "rise") {
    if (isF) {
      message = `${ownerName(owner)}の「成り上がり社長」発動！ 攻撃力+25！`;
      return { playerBonus: 25, cpuBonus: 0, message };
    } else {
      message = `${ownerName(owner)}の「成り上がり社長」発動！ 攻撃力+5！`;
      return { playerBonus: 5, cpuBonus: 0, message };
    }
  }

  if (eventCard.effect === "flame") {
    if (isF) {
      if (owner === "player") {
        playerPP -= 300;
      } else {
        cpuPP -= 300;
      }

      message = `${ownerName(owner)}の「炎上覚悟の逆転劇」！ 相手攻撃力-20、反動300！`;
      return { playerBonus: 0, cpuBonus: -20, message };
    } else {
      if (owner === "player") {
        playerPP -= 300;
      } else {
        cpuPP -= 300;
      }

      message = `${ownerName(owner)}の「炎上覚悟の逆転劇」は不発！ 反動300！`;
      return { playerBonus: 0, cpuBonus: 0, message };
    }
  }

  if (eventCard.effect === "heal") {
    if (owner === "player") {
      playerPP += isF ? 800 : 200;
      playerPP = Math.min(playerPP, maxPP);
    } else {
      cpuPP += isF ? 800 : 200;
      cpuPP = Math.min(cpuPP, maxPP);
    }

    message = `${ownerName(owner)}の「登録者100万人」！ PP回復！`;
    return { playerBonus: 0, cpuBonus: 0, message };
  }

  if (eventCard.effect === "buzz") {
    const success = isF && Math.random() < 0.5;

    if (success) {
      if (owner === "player") {
        cpuPP -= 1000;
      } else {
        playerPP -= 1000;
      }

      message = `${ownerName(owner)}の「一発逆転のバズ」成功！ 1000ダメージ！`;
    } else {
      message = `${ownerName(owner)}の「一発逆転のバズ」失敗！`;
    }

    return { playerBonus: 0, cpuBonus: 0, message };
  }

  return noEffect;
}

function ownerName(owner) {
  return owner === "player" ? "あなた" : "CPU";
}

function cpuUseEvent() {
  const eventIndex = cpuHand.findIndex(card => card.type === "event");

  if (eventIndex === -1) return;

  const level = cpuLevelSelect.value;

  if (level === "easy") {
    if (Math.random() < 0.25) setCpuEvent(eventIndex);
  }

  if (level === "normal") {
    if (Math.random() < 0.5) setCpuEvent(eventIndex);
  }

  if (level === "hard") {
    setCpuEvent(eventIndex);
  }
}

function setCpuEvent(index) {
  cpuEvent = cpuHand[index];
  cpuHand.splice(index, 1);
  cpuHand.push(randomCard());
  cpuLine.textContent = `CPUがイベント「${cpuEvent.name}」をセット！`;
}

function chooseCpuUniversityCard(playerCard) {
  const universityIndexes = [];

  for (let i = 0; i < cpuHand.length; i++) {
    if (cpuHand[i].type === "university") {
      universityIndexes.push(i);
    }
  }

  if (universityIndexes.length === 0) {
    cpuHand.push(randomUniversityCard());
    return cpuHand.length - 1;
  }

  const level = cpuLevelSelect.value;

  if (level === "easy") {
    return universityIndexes[Math.floor(Math.random() * universityIndexes.length)];
  }

  if (level === "normal") {
    if (Math.random() < 0.5) {
      return smartCpuIndex(universityIndexes, playerCard);
    }
    return universityIndexes[Math.floor(Math.random() * universityIndexes.length)];
  }

  return smartCpuIndex(universityIndexes, playerCard);
}

function smartCpuIndex(indexes, playerCard) {
  const winning = indexes.filter(i => cpuHand[i].power > playerCard.power);

  if (winning.length > 0) {
    let best = winning[0];
    for (let i of winning) {
      if (cpuHand[i].power < cpuHand[best].power) best = i;
    }
    return best;
  }

  let weakest = indexes[0];
  for (let i of indexes) {
    if (cpuHand[i].power < cpuHand[weakest].power) weakest = i;
  }
  return weakest;
}

function randomUniversityCard() {
  const universities = deck.filter(card => card.type === "university");
  return universities[Math.floor(Math.random() * universities.length)];
}

function updatePP() {
  playerPP = Math.max(0, Math.floor(playerPP));
  cpuPP = Math.max(0, Math.floor(cpuPP));

  playerPPText.textContent = playerPP;
  cpuPPText.textContent = cpuPP;

  const playerRatio = playerPP / maxPP;
  const cpuRatio = cpuPP / maxPP;

  playerBar.style.width = `${playerRatio * 100}%`;
  cpuBar.style.width = `${cpuRatio * 100}%`;

  playerText.textContent = `${playerPP} / ${maxPP}`;
  cpuText.textContent = `${cpuPP} / ${maxPP}`;

  setHPColor(playerBar, playerRatio);
  setHPColor(cpuBar, cpuRatio);
}

function setHPColor(bar, ratio) {
  if (ratio > 0.6) {
    bar.style.background = "linear-gradient(90deg, #00ff00, #00cc00)";
  } else if (ratio > 0.3) {
    bar.style.background = "linear-gradient(90deg, #ffff00, #ffcc00)";
  } else {
    bar.style.background = "linear-gradient(90deg, #ff0000, #cc0000)";
  }
}

function showDamage(x, y, damage) {
  const div = document.createElement("div");
  div.className = "damage";
  div.textContent = `-${Math.floor(damage)}`;
  div.style.left = x + "px";
  div.style.top = y + "px";

  damageContainer.appendChild(div);

  setTimeout(() => {
    div.remove();
  }, 800);
}

function shakeElement(element) {
  element.classList.add("shake");

  setTimeout(() => {
    element.classList.remove("shake");
  }, 350);
}

function checkGameOver() {
  if (playerPP <= 0) {
    result.textContent = "あなたの敗北……CPUの勝ち！";
    playerLine.textContent = "まだ次がある……！";
    cpuLine.textContent = "今回はこっちの勝ちやな。";
    gameOver = true;
  } else if (cpuPP <= 0) {
    result.textContent = "あなたの勝利！";
    playerLine.textContent = "完全勝利！";
    cpuLine.textContent = "やられたわ……";
    gameOver = true;
  }
}
