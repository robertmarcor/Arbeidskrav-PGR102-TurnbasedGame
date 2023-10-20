//
//  Game where heroes can fight a boss, and supports can assist in battle
//  Game ends if Boss reaches 0 health, or if all heroes reach 0 health
//  Game is auto turn based, each turn is started by the player.
//  The enemy will always do their turn after the player.
//
//Characters are constructed with name, health, damage, mainStat, healthBar, idSelector
import { Hero } from "./characterStats.js";
import { Support } from "./characterStats.js";
import { Boss } from "./characterStats.js";
import { Monster } from "./characterStats.js";

function autoScroll() {
  outputText.scrollTo({
    top: outputText.scrollHeight,
    behavior: "smooth",
  });
}
//Selectors
const outputText = document.getElementById("output-div");
const gameContainer = document.getElementById("container");
const menuDiv = document.getElementById("menu-div");
const modal = document.getElementById("modal-div");
const modalContent = document.getElementById("modal-content");
const modalCloseBtn = document.getElementById("modal-close-btn");

const showStatsBtn = document.getElementById("show-stats");

// Construct Hero Stats ////////////////////////////////////////
const nameslessHealthBar = document.getElementById("nameless-knight-hp-div");
const namelessHealthBarText = document.getElementById(
  "nameless-knight-hp-text"
);
const namelessID = document.getElementById("nameless-knight");
const namelessKnight = new Hero(
  "Nameless Knight",
  150 /* HP */,
  25 /* DMG */,
  300 /* Main Stat */,
  nameslessHealthBar /* Health Bar */,
  namelessHealthBarText /* Health Bar Text */,
  namelessID /* ID Selector */
);
const juliaHealthBar = document.getElementById("julia-the-archer-hp-div");
const juliaHealthBarText = document.getElementById("julia-the-archer-hp-text");
const juliaID = document.getElementById("julia-the-archer");
const arrowText = document.getElementById("arrow-div-text");
let juliaArrows = 3;
const juliaTheArcher = new Hero(
  "Julia the Archer",
  70 /* HP */,
  120 /* DMG */,
  30 /* Main Stat */,
  juliaHealthBar /* Health Bar */,
  juliaHealthBarText /* Health Bar Text */,
  juliaID /* ID Selector */
);
const catHealthBar = document.getElementById("the-cat-hp-div");
const catHealthBarText = document.getElementById("the-cat-hp-text");
const catID = document.getElementById("the-cat");
const theCat = new Hero(
  "The Cat",
  50 /* HP */,
  500 /* DMG */,
  400 /* Main Stat */,
  catHealthBar /* Health Bar */,
  catHealthBarText /* Health Bar Text */,
  catID /* ID Selector */
);
// Construct Support Stats/////////////////////////////////////
const williamManaBar = document.getElementById("william-the-healer-mana-div");
const williamManaBarText = document.getElementById(
  "william-the-healer-mana-text"
);
const williamID = document.getElementById("william-the-healer");
const williamTheHealer = new Support(
  "William the Healer",
  100 /* Mana */,
  5 /* Mana Regen */,
  50 /* Base Power */,
  1.3 /* Supporting Multiplier */,
  williamManaBar /* Mana Bar */,
  williamManaBarText /* Mana Bar Text */,
  williamID /* ID Selector */
);
const jackManaBar = document.getElementById("jack-the-lumberjack-mana-div");
const jackManaBarText = document.getElementById(
  "jack-the-lumberjack-mana-text"
);
const jackID = document.getElementById("jack-the-lumberjack");
const jackTheLumberjack = new Support(
  "Jack the Lumberjack",
  50 /* Mana */,
  10 /* Mana Regen */,
  3 /* Base Power */,
  1 /* Supporting Multiplier */,
  jackManaBar /* Mana Bar */,
  jackManaBarText /* Mana Bar Text */,
  jackID /* ID Selector */
);
// Construct Boss Stats///////////////////////////////
const bossHealthBar = document.getElementById("big-boss-hp-div");
const bossHealthBarText = document.getElementById("big-boss-hp-text");
const bossID = document.getElementById("big-boss");
const bigBoss = new Boss(
  "Big Boss",
  1000 /* HP */,
  20 /* DMG */,
  80 /* Main Stat */,
  false /* Enrage */,
  bossHealthBar /* Health Bar */,
  bossHealthBarText /* Health Bar Text */,
  bossID /* ID Selector */
);
// Construct Monsters///////////////////////////////
const monsterImage = document.getElementById("appearing-monster");
const monsterText = document.getElementById("appearing-monster-text");
const slime = new Monster("Slime", 2 /* HP */, 10 /* DMG */, monsterImage);
const bat = new Monster("Bat", 2 /* HP */, 20 /* DMG */, monsterImage);

function logStats() {
  console.log(bigBoss);
  console.log(namelessKnight);
  console.log(juliaTheArcher);
  console.log(theCat);
}
function setVisuals() {
  arrowText.innerHTML = `<div>x${juliaArrows}</div>`;
}

function setHealthBar() {
  // Our heroes
  namelessKnight.healthBar.style.width = "100%";
  namelessHealthBarText.innerHTML = `<p>HP: ${namelessKnight.health} / ${namelessKnight.maxHealth}</p>`;

  juliaTheArcher.healthBar.style.width = "100%";
  juliaHealthBarText.innerHTML = `<p>HP: ${juliaTheArcher.health} / ${juliaTheArcher.maxHealth}</p>`;

  theCat.healthBar.style.width = "100%";
  catHealthBarText.innerHTML = `<p>HP: ${theCat.health} / ${theCat.maxHealth}</p>`;

  //Enemy
  bigBoss.healthBar.style.width = "100%";
  bossHealthBarText.innerHTML = `<p>HP: ${bigBoss.health} / ${bigBoss.maxHealth}</p>`;

  // monsterText.innerHTML = `HP: ${slime.health} / ${slime.maxHealth}`;
}
function setManaBar() {
  williamTheHealer.manaBar.style.width = "100%";
  williamManaBarText.innerHTML = `<p>Mana: ${williamTheHealer.mana} / ${williamTheHealer.maxMana}</p>`;
  jackTheLumberjack.manaBar.style.width = "100%";
  jackManaBarText.innerHTML = `<p>Mana: ${jackTheLumberjack.mana} / ${jackTheLumberjack.maxMana}</p>`;
}
function updateHealthBar(target) {
  //Health bars are set to 100% width at the start.
  //Max health is refered to as "full health"
  //Then calculate current health, to percentage of full health and set health bar equal to that
  target.healthBar.style.width = `${(target.health / target.maxHealth) * 100}%`;
  target.healthBarText.innerHTML = `<p>HP: ${target.health} / ${target.maxHealth}</p>`;
  //Make sure to not let health drop below 0, and set image to headstone to simulate death
  if (target.health <= 0) {
    target.healthBar.style.width = "0%";
    target.idSelector.src = `./images/headstone.png`;
  }
}
function updateManaBar(target) {
  target.manaBar.style.width = `${(target.mana / target.maxMana) * 100}%`;
  target.manaBarText.innerHTML = `<p>Mana: ${target.mana} / ${target.maxMana}</p>`;
  if (target.mana <= 0) {
    target.manaBar.style.width = "0%";
  }
}
function damageTakenAnimation(target) {
  setTimeout(() => {
    target.idSelector.style.filter =
      "brightness(100%) hue-rotate(0deg) saturate(100%) brightness(150%)";
  }, 100);
  setTimeout(() => {
    target.idSelector.style.display = "none";
  }, 200);
  setTimeout(() => {
    target.idSelector.style.display = "block";
  }, 220);
  setTimeout(() => {
    target.idSelector.style.display = "none";
  }, 250);
  setTimeout(() => {
    target.idSelector.style.display = "block";
    target.idSelector.style.filter = "saturate(1)";
  }, 300);
}
function updateVisuals(attacker, damage, target) {
  // Arrow counter for Julia
  outputText.innerHTML += `<p><span class="friendly">${attacker.name}</span> attacks <span class="enemy">${target.name}</span> for <span class="damage">${damage}</span> damage!</p>`;

  //Nudge animation to simulate attacking
  attacker.idSelector.style.transform = "translateX(20px)";
  setTimeout(() => {
    attacker.idSelector.style.transform = "translateX(0px)";
  }, 300);

  //Flash to indicate damage taken
  damageTakenAnimation(target);

  //Dont update health bar for monsters, since they dont have one
  if (target != slime && target != bat) {
    updateHealthBar(target);
  }
  //Instead reset image to portal if monster is killed, and set monsterAlive to false so it can respawn
  if (
    (target.health <= 0 && target == slime) ||
    (target.health <= 0 && target == bat)
  ) {
    monsterAlive = false;
    setTimeout(() => {
      target.idSelector.src = `./images/portal.png`;
    }, 1200);
  }

  autoScroll();
}
function calculateDamage(attacker) {
  let damage = attacker.damage;
  let mainStat = attacker.mainStat;
  //Damage is calculated by base damage + random number between (0 - mainStat/10)
  //Eg. 20base damage, 40mainStat/10=4, random number between 0-4 is added to base damage
  let damageDealt = damage + Math.floor((Math.random() * mainStat) / 10);
  return damageDealt;
}
//Takes parameters to update visuals and health
function attack(attacker, damage, target) {
  let damageToTarget = damage;
  console.log("Target health Before: " + target.health);

  console.log("Target health: " + target.health);

  updateVisuals(attacker, damage, target);
  target.health -= damageToTarget;
  if (target.health <= 0) {
    target.health = 0;
    outputText.innerHTML += `<p><span class="enemy">${target.name}</span> has died!</p>`;
  }
}

let monsterAlive = false;
let randomMonster;
function spawnMonster() {
  //Set spawn chance, eg. 2 = 50% chance, 3 = 33% chance, 4 = 25% chance since 1/2, 1/3, 1/4
  let spawnChance = 4;
  let roll = Math.floor(Math.random() * spawnChance + 1);
  //Possible spawns
  let monsters = [slime, bat];
  //Select at random
  randomMonster = monsters[Math.floor(Math.random() * monsters.length)];

  if (roll == spawnChance) {
    monsterImage.src = `./images/${randomMonster.name}.png`;
    monsterAlive = true;
    //Reset monster health, in case it was killed before
    randomMonster.health = randomMonster.maxHealth;

    outputText.innerHTML += `<p><span class="monster">${randomMonster.name}</span> has appeared!</p>`;
    autoScroll();
    return monsterAlive, randomMonster;
  }
}
function disableHero(hero) {
  hero.idSelector.style.pointerEvents = "none";
}
function disableAllHeros() {
  namelessKnight.idSelector.style.pointerEvents = "none";
  juliaTheArcher.idSelector.style.pointerEvents = "none";
  theCat.idSelector.style.pointerEvents = "none";
  williamTheHealer.idSelector.style.pointerEvents = "none";
  jackTheLumberjack.idSelector.style.pointerEvents = "none";
}
function activateHero(hero) {
  hero.idSelector.style.pointerEvents = "auto";
}
function ActivateAllHeros() {
  if (namelessKnight.health != 0) {
    namelessKnight.idSelector.style.pointerEvents = "auto";
  }
  if (juliaTheArcher.health != 0) {
    juliaTheArcher.idSelector.style.pointerEvents = "auto";
  }
  if (theCat.health != 0) {
    theCat.idSelector.style.pointerEvents = "auto";
  }
  williamTheHealer.idSelector.style.pointerEvents = "auto";
  jackTheLumberjack.idSelector.style.pointerEvents = "auto";
}
function gameOver(result) {
  gameContainer.style.display = "none";
  menuDiv.style.display = "none";
  outputText.style.maxHeight = "100vh";
  outputText.style.height = "100%";
  if (result == "win") {
    outputText.innerHTML += `<h1>Game Over</h1>`;
    outputText.innerHTML += `<p>Big Boss has been defeated!</p>`;
    outputText.innerHTML += `<p>It took you ${turnCounter} turns to defeat Big Boss!</p>`;
    outputText.innerHTML += `<h2>You Win!</h2>`;
  } else if (result == "lose") {
    outputText.innerHTML += `<h1>Game Over</h1>`;
    outputText.innerHTML += `<p>Big Boss has defeated you!</p>`;
    outputText.innerHTML += `<p>You Lose!</p>`;
  }
  disableAllHeros();
}
function manaRegen() {
  if (williamTheHealer.mana >= williamTheHealer.maxMana) {
    williamTheHealer.mana = williamTheHealer.maxMana;
    console.log("William mana is full");
  }
  if (jackTheLumberjack.mana >= jackTheLumberjack.maxMana) {
    jackTheLumberjack.mana = jackTheLumberjack.maxMana;
    console.log("Jack mana is full");
  }
  if (williamTheHealer.mana < williamTheHealer.maxMana) {
    williamTheHealer.mana += williamTheHealer.manaRegen;
  }
  if (williamTheHealer.mana < williamTheHealer.maxMana) {
    jackTheLumberjack.mana += jackTheLumberjack.manaRegen;
  }

  updateManaBar(williamTheHealer);
  updateManaBar(jackTheLumberjack);
}
function healthRegen(characters) {}
let turnCounter = 0;
let playerInteracted = false;
function gameLoop() {
  let gameState = "";
  if (juliaArrows <= 0) {
    outputText.innerHTML += `<p> <span class="friendly">${juliaTheArcher.name} is out of arrows, damage will be reduced</p>`;
  }

  if (turnCounter != 0) {
    manaRegen();
  }
  if (
    juliaTheArcher.health <= 0 &&
    namelessKnight.health <= 0 &&
    theCat.health <= 0
  ) {
    gameState = "lose";
    gameOver(gameState);
  }
  if (bigBoss.health <= 0) {
    gameState = "win";
    gameOver(gameState);
  }
  if (williamTheHealer.mana <= 0) {
    outputText.innerHTML += `<p> <span class="friendly">${williamTheHealer.name}</span> is out of mana, he can no longer heal!</p>`;
    disableHero(williamTheHealer);
  }
  if (jackTheLumberjack.mana <= 0) {
    outputText.innerHTML += `<p> <span class="friendly">${jackTheLumberjack.name}</span> is out of mana, he can no longer craft arrows!</p>`;
    outputText.innerHTML += `<p> Wait for him to regain to full</p>`;
    disableHero(jackTheLumberjack);
  }
  if (turnCounter != 0) {
    outputText.innerHTML += `<h3>----------------------------- Turn ${turnCounter} -----------------------------</h3>`;
  }
  turnCounter++;
  setTimeout(() => {
    autoScroll();
  }, 200);
  return turnCounter;
}
function healTarget(target, amount) {
  target.health += amount;
  if (target.health >= target.maxHealth) {
    target.health = target.maxHealth;
  }
  updateHealthBar(target);
  target.idSelector.style.filter =
    "brightness(100) sepia(100) saturate(10) hue-rotate(40deg)";
  setTimeout(() => {
    target.idSelector.style.filter = "";
  }, 150);
  outputText.innerHTML += `<p><span class="friendly">${williamTheHealer.name}</span> heals <span class="friendly">${target.name}</span> for <span class="heal">${amount}</span> HP`;
}
function craftArrows(amount) {
  juliaArrows += amount;
  arrowText.innerHTML = `<div>x${juliaArrows}</div>`;
  return juliaArrows;
}
function updateMana(hero, amount) {
  hero.mana -= amount;
  if (hero.mana <= 0) {
    hero.mana = 0;
  }
}
function williamHeal() {
  //Sort list of allies based on lowest heatlh value, and select it as the target
  const allies = [namelessKnight, juliaTheArcher, theCat];
  const lowestAlly = allies.sort((a, b) => a.health - b.health)[0];

  //Calculate heal amount, based on base stat * support multiplier
  const baseHeal = williamTheHealer.baseStat;
  const healMulti = williamTheHealer.supportMultiplier;
  const healAmount = baseHeal * healMulti + Math.floor(Math.random() * 10);
  const manaCost = 20;
  healTarget(lowestAlly, healAmount);
  updateMana(williamTheHealer, manaCost);
  updateManaBar(williamTheHealer);
}

function jackCraft() {
  const allyArchers = [juliaTheArcher];

  const craftPower = jackTheLumberjack.baseStat;
  const craftMulti = jackTheLumberjack.supportMultiplier;
  const craftAmount = craftPower * craftMulti;
  const manaCost = 50;
  craftArrows(craftAmount);
  updateMana(jackTheLumberjack, manaCost);
  updateManaBar(jackTheLumberjack);
}
function supportTurn(support) {
  if (playerTurn == true) {
    disableAllHeros();
  }
  playerTurn = false;

  if (support == williamTheHealer) {
    williamHeal();
  } else if (support == jackTheLumberjack) {
    jackCraft();
  }

  // *NOTE could be moved to enemyTurn to not repeat code
  setTimeout(() => {
    //Re-enable hero's, only if their health is not 0
    ActivateAllHeros();
  }, 3000);

  setTimeout(() => {
    enemyTurn();
  }, 1500);
}
console.log(turnCounter);
// Main game loop, will playout a full turn once a hero is clicked
let playerTurn = true;
function playTurn(hero, randomMonster, monsterAlive) {
  // While its the players turn, disable the hero's for 1 second to prevent spam clicking
  if (playerTurn == true) {
    disableAllHeros();
  }
  // Set player turn to false, so that it can be toggled again.
  playerTurn = false;

  // Check if monster a monster has spawned, if yes, prevent attacking boss.
  // Target automatilly assigned to monster if it is alive
  let target;
  if (!monsterAlive) {
    target = bigBoss;
  } else if (monsterAlive) {
    target = randomMonster;
  }
  // Calculate damage, randomized amount between hero base damage and main stat
  let heroDamage = calculateDamage(hero);

  // Check julia's arrows, if out of arrows, do reduced damage
  if (hero == juliaTheArcher && juliaArrows <= 0) {
    heroDamage * 0.2; /* Reduce damage by 80% */
  }

  // Check if damage should apply to monster
  if (target == slime || target == bat) {
    if (target == slime && hero == juliaTheArcher) {
      heroDamage = 1;
      outputText.innerHTML += `<p>Arrows are not very effective vs <span class="monster">${randomMonster}</span></p>`;
    } else if (target == slime && hero == namelessKnight) {
      heroDamage = 1;
      outputText.innerHTML += `<p> <span>Melee attacks</span> are reduced vs <span style="monster">${randomMonster.name}</span> is strong against melee attacks!</p>`;
    }
    if (target == bat && hero == theCat) {
      heroDamage = 1;
      outputText.innerHTML += `<p> <span>Magic attacks</span> is reduced vs <span style="monster">${randomMonster.name}</span> is strong against magic attacks!</p>`;
    } else if (target == bat && hero == namelessKnight) {
      heroDamage = 1;
      outputText.innerHTML += `<p> <span>Melee attacks</span> is reduced vs <span style="monster">${randomMonster.name}</span> is strong against melee attacks!</p>`;
    }
  }
  // Once damage is calculated, apply it to the target
  attack(hero, heroDamage, target);

  //Re-enable hero's, only if their health is not 0
  setTimeout(() => {
    ActivateAllHeros();
  }, 3000);

  // Automatically have enemy play their turn
  setTimeout(enemyTurn, 2500);
}

function enemyTurn() {
  // End game if boss is dead
  if (bigBoss.health <= 0) {
    gameLoop();
  }

  let bossDamage = calculateDamage(bigBoss);
  let possibleTargets = [namelessKnight, juliaTheArcher, theCat];

  // Filter out dead targets
  possibleTargets = possibleTargets.filter((target) => target.health > 0);
  // Randomly select a target from the possible targets array
  let randomTarget =
    possibleTargets[Math.floor(Math.random() * possibleTargets.length)];
  let moves = ["stomp"];
  let move = moves[Math.floor(Math.random() * moves.length)];

  if (move == "stomp") {
    outputText.innerHTML += `<p><span class="enemy">${bigBoss.name}</span> stomps the ground, dealing <span class="damage">${bossDamage}</span> damage to everyone!</p>`;
    bigBoss.idSelector.style.transform = "translateX(-600px)";
    setTimeout(() => {
      bigBoss.idSelector.style.transform = "translate(-600px, -200px)";
    }, 900);
    setTimeout(() => {
      bigBoss.idSelector.style.transform = "translate(-600px, 20px)";
    }, 1000);
    setTimeout(() => {
      bigBoss.idSelector.style.transform = "translate(0px, 0px) rotate(0deg)";
      for (let target of possibleTargets) {
        target.health -= bossDamage;
        updateHealthBar(target);
        damageTakenAnimation(target);
      }
    }, 3000);
  } else {
    outputText.innerHTML += `<p><span class="enemy">${bigBoss.name}</span> retaliates, hits <span class="friendly">${randomTarget.name}</span> for <span class="damage">${bossDamage}</span> damage!</p>`;

    //Animation
    bigBoss.idSelector.style.transform = "translateX(-600px) rotate(20deg)";
    setTimeout(() => {
      bigBoss.idSelector.style.transform = "translateX(0px)";
    }, 300);
    randomTarget.health -= bossDamage;
  }
  autoScroll();

  damageTakenAnimation(randomTarget);

  //Do Damage and update healthbar
  updateHealthBar(randomTarget);
  if (randomTarget.health <= 0) {
    randomTarget.health = 0;
    randomTarget.idSelector.style.pointerEvents = "none";
    outputText.innerHTML += `<p><span class="friendly">${randomTarget.name}</span> has died!</p>`;
  }
  //Check for monster spawn
  if (!monsterAlive) {
    setTimeout(spawnMonster, 2000);
  }
  //End turn by handing it over to the player
  setTimeout(() => {
    playerTurn = true;
    //Takes care of tuns, and auto scrolling
    gameLoop();
  }, 2000);
}
setVisuals();
setHealthBar();
setManaBar();
gameLoop();
disableHero(williamTheHealer);
disableHero(jackTheLumberjack);
// Start Game by clicking on hero
window.onclick = (event) => {
  if (event.target == namelessKnight.idSelector) {
    playTurn(namelessKnight, randomMonster, monsterAlive);
  } else if (event.target == juliaTheArcher.idSelector) {
    juliaArrows -= 1;
    arrowText.innerHTML = `<div>x${juliaArrows}</div>`;
    playTurn(juliaTheArcher, randomMonster, monsterAlive);
  } else if (event.target == theCat.idSelector) {
    playTurn(theCat, randomMonster, monsterAlive);
  } else if (event.target == williamTheHealer.idSelector) {
    supportTurn(williamTheHealer);
  } else if (event.target == jackTheLumberjack.idSelector) {
    supportTurn(jackTheLumberjack);
  }

  if (event.target == modal) {
    modal.style.display = "none";
  }
};

modalCloseBtn.onclick = () => {
  modal.style.display = "none";
};

showStatsBtn.onclick = () => {
  // Setup Screen
  modal.style.display = "flex";
  modalContent.innerHTML = `
    <div class="stats-div">
        <div class="stats-container">
            <h3><b>Heroes Base Stats</b></h3>
            <p><b>Nameless Knight:</b> [ ${namelessKnight.health} HP ][ ${namelessKnight.damage} DMG ] <b>MELEE</b> </p>
            <p><b>Julia the Archer:</b> [ ${juliaTheArcher.health} HP ][ ${juliaTheArcher.damage} DMG ] <b>RANGED</b></p>
            <p><b>The Cat:</b> [ ${theCat.health} HP ][ ${theCat.damage} DMG ]<b>MAGIC</b></p>
        </div>

        <div class="stats-container">
            <h3><b>Enemies Base Stats</b></h3>
            <p><b>Big Boss:</b> [ ${bigBoss.health} HP] immune to ranged/magic</p>
            <p><b>Slime:</b> [ ${slime.health} HP ] immune to melee/ranged</p>
            <p><b>Bat: </b>[ ${bat.health} HP ] immune to ranged/melee</p>
        </div>
    </div>
    <hr>
    `;
};
