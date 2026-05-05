const maxPP = 4000;

const masterDeck = [
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

let playerDeck = [];
let cpuDeck = [];

let playerHand = [];
let cpuHand = [];

let playerEvent = null;
let cpuEvent = null;

let gameOver = false;
let soundOn = true;

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

const playerField = document.getElementById("playerField");
const cpuField = document.getElementById("cpuField");

const result = document.getElementById("result");
const handArea = document.getElementById("hand");
const resetBtn = document.getElementById("resetBtn");
const cpuLevelSelect = document.getElementById("cpuLevel");
const damageContainer = document.getElementById("damageContainer");

const playerLine = document.getElementById("playerLine");
const cpuLine = document.getElementById("cpuLine");
const soundBtn = document.getElementById("soundBtn");

resetBtn.addEventListener("click", startGame);

soundBtn.addEventListener("click", () => {
  soundOn = !soundOn;
  soundBtn.textContent = soundOn ? "効果音：ON" : "効果音：OFF";
});

startGame();

function startGame() {
  playerPP = maxPP;
  cpuPP = maxPP;

  playerDeck = shuffleDeck([...masterDeck]);
  cpuDeck = shuffleDeck([...masterDeck]);

  playerHand = [];
  cpuHand = [];

  playerEvent = null;
  cpuEvent = null;
  gameOver = false;

  for (let i = 0; i < 5; i++) {
    playerHand.push(drawCard(playerDeck));
    cpuHand.push(drawCard(cpuDeck));
  }

  playerName.textContent = "？？？";
  playerPower.textContent = "-";
  cpuName.textContent = "？？？";
  cpuPower.textContent = "-";

  playerField.className = "field-card";
  cpuField.className = "field-card";

  playerLine.textContent = "いくぞ、学歴バトル開始！";
  cpuLine.textContent = "これは読み合いやな。";
  result.textContent = "手札からカードを選べ！";

  updatePP();
  showHand();
}

function shuffleDeck(cards) {
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

function drawCard(deckArray) {
  if (deckArray.length === 0) {
    deckArray.push(...shuffleDeck([...masterDeck]));
  }

  return deckArray.pop();
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

function playCard(index) {
  if (gameOver) return;

  const card = playerHand[index];

  if (card.type === "event") {
    playerEvent = card;
    playerHand.splice(index, 1);
    playerHand.push(drawCard(playerDeck));

    result.textContent = `イベント「${card.name}」をセット！ 次の大学カードで発動！`;
    playerLine.textContent = `ここで「${card.name}」や！`;
    playSound("event");
    showHand();
    return;
  }

  playTurn(index);
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

  const messages = [];

  const playerEventResult = applyEvent("player", playerEvent, playerCard);
  playerPowerValue += playerEventResult.ownBonus;
  cpuPowerValue += playerEventResult.enemyBonus;
  if (playerEventResult.message) messages.push(playerEventResult.message);

  const cpuEventResult = applyEvent("cpu", cpuEvent, cpuCard);
  cpuPowerValue += cpuEventResult.ownBonus;
  playerPowerValue += cpuEventResult.enemyBonus;
  if (cpuEventResult.message) messages.push(cpuEventResult.message);

  playerEvent = null;
  cpuEvent = null;

  playerHand.splice(playerIndex, 1);
  cpuHand.splice(cpuIndex, 1);

  playerHand.push(drawCard(playerDeck));
  cpuHand.push(drawCard(cpuDeck));

  showFieldCard("player", playerCard);
  showFieldCard("cpu", cpuCard);

  if (playerPowerValue > cpuPowerValue) {
    const damage = Math.floor((playerPowerValue - cpuPowerValue) * 100);
    cpuPP -= damage;

    const rect = cpuName.getBoundingClientRect();
    showDamage(rect.left + 30, rect.top, damage);
    shakeElement(cpuField);
    playSound("damage");

    result.textContent = `${messages.join(" ")} あなたの勝ち！ CPUに${damage}ダメージ！`;
    playerLine.textContent = "学歴マウント成功！";
    cpuLine.textContent = "今のは痛いな……";

  } else if (playerPowerValue < cpuPowerValue) {
    const damage = Math.floor((cpuPowerValue - playerPowerValue) * 100);
    playerPP -= damage;

    const rect = playerName.getBoundingClientRect();
    showDamage(rect.left + 30, rect.top, damage);
    shakeElement(playerField);
    playSound("damage");

    result.textContent = `${messages.join(" ")} CPUの勝ち！ あなたに${damage}ダメージ！`;
    playerLine.textContent = "くっ、まだ終わってない！";
    cpuLine.textContent = "読み勝ちやな。";

  } else {
    result.textContent = `${messages.join(" ")} 引き分け！`;
    playerLine.textContent = "互角か……";
    cpuLine.textContent = "ええ勝負や。";
    playSound("event");
  }

  updatePP();
  checkGameOver();
  showHand();
}

function showFieldCard(side, card) {
  const label = getLabel(card.power);

  if (side === "player") {
    playerName.textContent = card.name;
    playerPower.textContent = label;
    playerField.className = `field-card card-${label}`;
  } else {
    cpuName.textContent = card.name;
    cpuPower.textContent = label;
    cpuField.className = `field-card card-${label}`;
  }
}

function applyEvent(owner, eventCard, ownUniversity) {
  const noEffect = {
    ownBonus: 0,
    enemyBonus: 0,
    message: ""
  };

  if (!eventCard) return noEffect;

  playSound("event");

  const isF = getLabel(ownUniversity.power) === "Fラン";
  const name = owner === "player" ? "あなた" : "CPU";

  if (eventCard.effect === "rise") {
    if (isF) {
      return {
        ownBonus: 25,
        enemyBonus: 0,
        message: `${name}の「成り上がり社長」発動！ Fランから攻撃力+25！`
      };
    }

    return {
      ownBonus: 5,
      enemyBonus: 0,
      message: `${name}の「成り上がり社長」発動！ 攻撃力+5！`
    };
  }

  if (eventCard.effect === "flame") {
    if (isF) {
      if (owner === "player") {
        playerPP -= 300;
      } else {
        cpuPP -= 300;
      }

      return {
        ownBonus: 0,
        enemyBonus: -20,
        message: `${name}の「炎上覚悟の逆転劇」！ 相手攻撃力-20、反動300！`
      };
    }

    if (owner === "player") {
      playerPP -= 300;
    } else {
      cpuPP -= 300;
    }

    return {
      ownBonus: 0,
      enemyBonus: 0,
      message: `${name}の「炎上覚悟の逆転劇」は不発！ 反動300！`
    };
  }

  if (eventCard.effect === "heal") {
    const heal = isF ? 800 : 200;

    if (owner === "player") {
      playerPP = Math.min(maxPP, playerPP + heal);
    } else {
      cpuPP = Math.min(maxPP, cpuPP + heal);
    }

    return {
      ownBonus: 0,
      enemyBonus: 0,
      message: `${name}の「登録者100万人」！ PPを${heal}回復！`
    };
  }

  if (eventCard.effect === "buzz") {
    const success = isF && Math.random() < 0.5;

    if (success) {
      if (owner === "player") {
        cpuPP -= 1000;
      } else {
        playerPP -= 1000;
      }

      return {
        ownBonus: 0,
        enemyBonus: 0,
        message: `${name}の「一発逆転のバズ」成功！ 1000ダメージ！`
      };
    }

    return {
      ownBonus: 0,
      enemyBonus: 0,
      message: `${name}の「一発逆転のバズ」失敗！`
    };
  }

  return noEffect;
}

function cpuUseEvent() {
  if (cpuEvent) return;

  const eventIndexes = [];

  for (let i = 0; i < cpuHand.length; i++) {
    if (cpuHand[i].type === "event") {
      eventIndexes.push(i);
    }
  }

  if (eventIndexes.length === 0) return;

  const level = cpuLevelSelect.value;

  if (level === "easy") {
    if (Math.random() < 0.25) {
      setCpuEvent(eventIndexes[0]);
    }
    return;
  }

  if (level === "normal") {
    if (Math.random() < 0.5) {
      setCpuEvent(eventIndexes[0]);
    }
    return;
  }

  const bestEventIndex = chooseBestCpuEvent(eventIndexes);
  setCpuEvent(bestEventIndex);
}

function chooseBestCpuEvent(eventIndexes) {
  const hpRatio = cpuPP / maxPP;

  const healIndex = eventIndexes.find(i => cpuHand[i].effect === "heal");
  if (hpRatio <= 0.5 && healIndex !== undefined) return healIndex;

  const riseIndex = eventIndexes.find(i => cpuHand[i].effect === "rise");
  if (riseIndex !== undefined) return riseIndex;

  const flameIndex = eventIndexes.find(i => cpuHand[i].effect === "flame");
  if (flameIndex !== undefined) return flameIndex;

  return eventIndexes[0];
}

function setCpuEvent(index) {
  cpuEvent = cpuHand[index];
  cpuHand.splice(index, 1);
  cpuHand.push(drawCard(cpuDeck));

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
      if (cpuHand[i].power < cpuHand[best].power) {
        best = i;
      }
    }

    return best;
  }

  let weakest = indexes[0];

  for (let i of indexes) {
    if (cpuHand[i].power < cpuHand[weakest].power) {
      weakest = i;
    }
  }

  return weakest;
}

function randomUniversityCard() {
  const universities = masterDeck.filter(card => card.type === "university");
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

function playSound(type) {
  if (!soundOn) return;

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  const audioCtx = new AudioContextClass();

  const oscillator = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  oscillator.connect(gain);
  gain.connect(audioCtx.destination);

  if (type === "damage") {
    oscillator.frequency.value = 120;
    gain.gain.value = 0.16;
  } else if (type === "win") {
    oscillator.frequency.value = 660;
    gain.gain.value = 0.13;
  } else if (type === "event") {
    oscillator.frequency.value = 440;
    gain.gain.value = 0.11;
  } else {
    oscillator.frequency.value = 220;
    gain.gain.value = 0.1;
  }

  oscillator.start();

  gain.gain.exponentialRampToValueAtTime(
    0.001,
    audioCtx.currentTime + 0.25
  );

  oscillator.stop(audioCtx.currentTime + 0.25);
}

function checkGameOver() {
  if (playerPP <= 0) {
    result.textContent = "あなたの敗北……CPUの勝ち！";
    playerLine.textContent = "まだ次がある……！";
    cpuLine.textContent = "今回はこっちの勝ちやな。";
    playSound("win");
    gameOver = true;
  } else if (cpuPP <= 0) {
    result.textContent = "あなたの勝利！";
    playerLine.textContent = "完全勝利！";
    cpuLine.textContent = "やられたわ……";
    playSound("win");
    gameOver = true;
  }
}
