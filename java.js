const maxPP = 4000;

const masterDeck = [
  { type: "university", name: "東京大学", power: 72.5, skill: "安定王者" },
  { type: "university", name: "京都大学", power: 70, skill: "天才のブレ" },
  { type: "university", name: "一橋大学", power: 67.5, skill: "堅実エリート" },
  { type: "university", name: "東京工業大学", power: 67.5, skill: "理系特化" },
  { type: "university", name: "大阪大学", power: 67.5, skill: "総合力" },
  { type: "university", name: "早稲田大学", power: 67.5, skill: "イベント力" },
  { type: "university", name: "慶應義塾大学", power: 67.5, skill: "ブランド回復" },
  { type: "university", name: "東北大学", power: 65, skill: "研究力" },
  { type: "university", name: "名古屋大学", power: 65, skill: "安定理系" },
  { type: "university", name: "北海道大学", power: 62.5, skill: "広大な余裕" },
  { type: "university", name: "九州大学", power: 62.5, skill: "地方帝大魂" },
  { type: "university", name: "筑波大学", power: 62.5, skill: "体育会補正" },
  { type: "university", name: "神戸大学", power: 62.5, skill: "港町エリート" },
  { type: "university", name: "上智大学", power: 62.5, skill: "国際力" },
  { type: "university", name: "横浜国立大学", power: 60, skill: "国立コスパ" },
  { type: "university", name: "明治大学", power: 60, skill: "Fランキラー" },
  { type: "university", name: "青山学院大学", power: 60, skill: "都会ブランド" },
  { type: "university", name: "立教大学", power: 60, skill: "おしゃれ補正" },
  { type: "university", name: "中央大学", power: 57.5, skill: "法学の底力" },
  { type: "university", name: "法政大学", power: 57.5, skill: "逆境耐性" },
  { type: "university", name: "日本大学", power: 50, skill: "人数の暴力" },
  { type: "university", name: "東洋大学", power: 50, skill: "粘り勝ち" },
  { type: "university", name: "駒澤大学", power: 50, skill: "駅伝ブースト" },
  { type: "university", name: "専修大学", power: 50, skill: "堅実中堅" },
  { type: "university", name: "帝京大学", power: 45, skill: "下剋上" },
  { type: "university", name: "東海大学", power: 45, skill: "体育会魂" },
  { type: "university", name: "亜細亜大学", power: 42.5, skill: "ワンチャン力" },
  { type: "university", name: "関東学院大学", power: 40, skill: "逆転準備" },
  { type: "university", name: "明星大学", power: 35, skill: "覚醒待ち" },

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

let gameMode = null;
let stage = 1;
let route = null;

const playerPPText = document.getElementById("playerPP");
const cpuPPText = document.getElementById("cpuPP");
const playerBar = document.getElementById("playerBar");
const cpuBar = document.getElementById("cpuBar");
const playerText = document.getElementById("playerText");
const cpuText = document.getElementById("cpuText");

const playerName = document.getElementById("playerName");
const playerPower = document.getElementById("playerPower");
const playerSkillText = document.getElementById("playerSkill");

const cpuName = document.getElementById("cpuName");
const cpuPower = document.getElementById("cpuPower");
const cpuSkillText = document.getElementById("cpuSkill");

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

resetBtn.addEventListener("click", () => {
  if (!gameMode) return;
  startGame();
});

soundBtn.addEventListener("click", () => {
  soundOn = !soundOn;
  soundBtn.textContent = soundOn ? "効果音：ON" : "効果音：OFF";
});

function startBattleMode() {
  gameMode = "battle";
  route = null;
  stage = 1;

  document.getElementById("modeSelect").style.display = "none";
  document.getElementById("routeSelect").style.display = "none";

  playerLine.textContent = "自由対戦モードや！";
  cpuLine.textContent = "いつでも相手になるで。";

  startGame();
}

function startStoryMode() {
  gameMode = "story";
  stage = 1;

  document.getElementById("modeSelect").style.display = "none";
  document.getElementById("routeSelect").style.display = "block";

  result.textContent = "ルートを選んでください";
}

function selectRoute(selectedRoute) {
  route = selectedRoute;
  document.getElementById("routeSelect").style.display = "none";

  playerLine.textContent =
    route === "stable"
      ? "堅実に勝つ…それが最適解だ。"
      : "全部ひっくり返す。";

  startGame();
}

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

  setupStage();

  for (let i = 0; i < 5; i++) {
    playerHand.push(drawCard(playerDeck));
    cpuHand.push(drawCard(cpuDeck));
  }

  playerName.textContent = "？？？";
  playerPower.textContent = "-";
  playerSkillText.textContent = "スキル：-";

  cpuName.textContent = "？？？";
  cpuPower.textContent = "-";
  cpuSkillText.textContent = "スキル：-";

  playerField.className = "field-card";
  cpuField.className = "field-card";

  updateStoryLines();
  updatePP();
  showHand();

  if (gameMode === "story") {
    result.textContent = `第${stage}章：手札からカードを選べ！`;
  } else {
    result.textContent = "手札からカードを選べ！";
  }
}

function setupStage() {
  if (gameMode !== "story") return;

  if (stage <= 2) cpuLevelSelect.value = "easy";
  else if (stage <= 4) cpuLevelSelect.value = "normal";
  else cpuLevelSelect.value = "hard";
}

function updateStoryLines() {
  if (gameMode !== "story") return;

  if (stage === 1) playerLine.textContent = "ここから始める…";
  if (stage === 2) playerLine.textContent = "イベントを使いこなす。";
  if (stage === 3) playerLine.textContent = "流れが来てる。";
  if (stage === 4) playerLine.textContent = "エリートの壁を越える。";
  if (stage === 5) playerLine.textContent = "ここで決める。";
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
        <p>スキル：${card.skill}</p>
      `;
    }

    div.onclick = () => playCard(i);
    handArea.appendChild(div);
  });
}

function playCard(index) {
  if (gameOver || !gameMode) return;

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

  const playerSkill = applySkill(playerCard, cpuCard, "player");
  playerPowerValue += playerSkill.bonus;
  if (playerSkill.message) {
    messages.push(playerSkill.message);
    glowElement(playerField);
    playSound("event");
  }

  const cpuSkill = applySkill(cpuCard, playerCard, "cpu");
  cpuPowerValue += cpuSkill.bonus;
  if (cpuSkill.message) {
    messages.push(cpuSkill.message);
    glowElement(cpuField);
    playSound("event");
  }

  const playerEventResult = applyEvent("player", playerEvent, playerCard);
  playerPowerValue += playerEventResult.ownBonus;
  cpuPowerValue += playerEventResult.enemyBonus;
  if (playerEventResult.message) messages.push(playerEventResult.message);

  const cpuEventResult = applyEvent("cpu", cpuEvent, cpuCard);
  cpuPowerValue += cpuEventResult.ownBonus;
  playerPowerValue += cpuEventResult.enemyBonus;
  if (cpuEventResult.message) messages.push(cpuEventResult.message);

  const routeResult = applyRouteBonus(playerCard, "player");
  playerPowerValue += routeResult.bonus;
  if (routeResult.message) messages.push(routeResult.message);

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
  }

  updatePP();
  checkGameOver();
  showHand();
}

function applySkill(card, opponentCard, owner) {
  let bonus = 0;
  let message = "";
  const name = owner === "player" ? "あなた" : "CPU";

  if (card.name === "東京大学") {
    bonus += 10;
    message = `${name}の東大スキル「安定王者」発動！ +10`;
  }

  if (card.name === "京都大学") {
    const rand = Math.floor(Math.random() * 41) - 20;
    bonus += rand;
    message = `${name}の京大スキル「天才のブレ」発動！ ${rand >= 0 ? "+" : ""}${rand}`;
  }

  if (card.name === "明治大学" && getLabel(opponentCard.power) === "Fラン") {
    bonus += 15;
    message = `${name}の明治スキル「Fランキラー」発動！ +15`;
  }

  if (card.name === "帝京大学") {
    bonus += 20;
    message = `${name}の帝京スキル「下剋上」発動！ +20`;
  }

  if (card.name === "明星大学" && (playerEvent || cpuEvent)) {
    bonus += 30;
    message = `${name}の明星スキル「覚醒待ち」発動！ +30`;
  }

  if (card.name === "日本大学" && Math.random() < 0.3) {
    bonus += 12;
    message = `${name}の日大スキル「人数の暴力」発動！ +12`;
  }

  if (card.name === "早稲田大学" && Math.random() < 0.5) {
    bonus += 8;
    message = `${name}の早稲田スキル「イベント力」発動！ +8`;
  }

  if (card.name === "慶應義塾大学") {
    if (owner === "player") playerPP = Math.min(maxPP, playerPP + 150);
    else cpuPP = Math.min(maxPP, cpuPP + 150);
    message = `${name}の慶應スキル「ブランド回復」発動！ PP+150`;
  }

  return { bonus, message };
}

function applyRouteBonus(card, owner) {
  if (gameMode !== "story") return { bonus: 0, message: "" };

  if (route === "stable" && card.power >= 65) {
    return { bonus: 8, message: "安定ルート補正：高学歴+8！" };
  }

  if (route === "reverse" && getLabel(card.power) === "Fラン") {
    return { bonus: 20, message: "逆転ルート補正：Fラン覚醒+20！" };
  }

  return { bonus: 0, message: "" };
}

function showFieldCard(side, card) {
  const label = getLabel(card.power);

  if (side === "player") {
    playerName.textContent = card.name;
    playerPower.textContent = label;
    playerSkillText.textContent = `スキル：${card.skill}`;
    playerField.className = `field-card card-${label}`;
  } else {
    cpuName.textContent = card.name;
    cpuPower.textContent = label;
    cpuSkillText.textContent = `スキル：${card.skill}`;
    cpuField.className = `field-card card-${label}`;
  }
}

function applyEvent(owner, eventCard, ownUniversity) {
  const noEffect = { ownBonus: 0, enemyBonus: 0, message: "" };
  if (!eventCard) return noEffect;

  playSound("event");

  const isF = getLabel(ownUniversity.power) === "Fラン";
  const name = owner === "player" ? "あなた" : "CPU";

  if (eventCard.effect === "rise") {
    return {
      ownBonus: isF ? 25 : 5,
      enemyBonus: 0,
      message: `${name}の「成り上がり社長」発動！ 攻撃力+${isF ? 25 : 5}！`
    };
  }

  if (eventCard.effect === "flame") {
    if (owner === "player") playerPP -= 300;
    else cpuPP -= 300;

    return {
      ownBonus: 0,
      enemyBonus: isF ? -20 : 0,
      message: isF
        ? `${name}の「炎上覚悟の逆転劇」！ 相手-20、反動300！`
        : `${name}の「炎上覚悟の逆転劇」は不発！ 反動300！`
    };
  }

  if (eventCard.effect === "heal") {
    const heal = isF ? 800 : 200;
    if (owner === "player") playerPP = Math.min(maxPP, playerPP + heal);
    else cpuPP = Math.min(maxPP, cpuPP + heal);

    return {
      ownBonus: 0,
      enemyBonus: 0,
      message: `${name}の「登録者100万人」！ PPを${heal}回復！`
    };
  }

  if (eventCard.effect === "buzz") {
    const success = isF && Math.random() < 0.5;

    if (success) {
      if (owner === "player") cpuPP -= 1000;
      else playerPP -= 1000;
    }

    return {
      ownBonus: 0,
      enemyBonus: 0,
      message: success
        ? `${name}の「一発逆転のバズ」成功！ 1000ダメージ！`
        : `${name}の「一発逆転のバズ」失敗！`
    };
  }

  return noEffect;
}

function cpuUseEvent() {
  if (cpuEvent) return;

  const eventIndexes = cpuHand
    .map((card, i) => card.type === "event" ? i : null)
    .filter(i => i !== null);

  if (eventIndexes.length === 0) return;

  const level = cpuLevelSelect.value;

  if (level === "easy" && Math.random() < 0.25) setCpuEvent(eventIndexes[0]);
  else if (level === "normal" && Math.random() < 0.5) setCpuEvent(eventIndexes[0]);
  else if (level === "hard") setCpuEvent(chooseBestCpuEvent(eventIndexes));
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
  const universityIndexes = cpuHand
    .map((card, i) => card.type === "university" ? i : null)
    .filter(i => i !== null);

  if (universityIndexes.length === 0) {
    cpuHand.push(randomUniversityCard());
    return cpuHand.length - 1;
  }

  const level = cpuLevelSelect.value;

  if (level === "easy") {
    return universityIndexes[Math.floor(Math.random() * universityIndexes.length)];
  }

  if (level === "normal") {
    return Math.random() < 0.5
      ? smartCpuIndex(universityIndexes, playerCard)
      : universityIndexes[Math.floor(Math.random() * universityIndexes.length)];
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

  setTimeout(() => div.remove(), 800);
}

function shakeElement(element) {
  element.classList.add("shake");
  setTimeout(() => element.classList.remove("shake"), 350);
}

function glowElement(element) {
  element.classList.add("skill-glow");
  setTimeout(() => element.classList.remove("skill-glow"), 800);
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
    return;
  }

  if (cpuPP <= 0) {
    if (gameMode === "story") {
      stage++;

      if (stage > 5) {
        ending();
        gameOver = true;
        return;
      }

      result.textContent = `第${stage - 1}章クリア！ 次の章へ！`;
      setTimeout(startGame, 900);
      return;
    }

    result.textContent = "あなたの勝利！";
    playerLine.textContent = "完全勝利！";
    cpuLine.textContent = "やられたわ……";
    playSound("win");
    gameOver = true;
  }
}

function ending() {
  if (route === "stable") {
    result.textContent = "安定ルートエンド：エリートとして成功！";
    playerLine.textContent = "これが…最適解だ。";
  } else {
    result.textContent = "逆転ルートエンド：下剋上達成！";
    playerLine.textContent = "全部ひっくり返した。";
  }

  cpuLine.textContent = "見事やな。";
  playSound("win");
}
