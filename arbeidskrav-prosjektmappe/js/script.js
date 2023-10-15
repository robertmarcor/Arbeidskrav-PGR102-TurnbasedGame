//Characters are constructed with name, health, damage, mainStat, healthBar, idSelector
import { Hero } from "./characterStats.js";
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
const modal = document.getElementById("modal-div");
const modalContent = document.getElementById("modal-content");
const modalCloseBtn = document.getElementById("modal-close-btn");

const showStatsBtn = document.getElementById("show-stats");
const standardGame = document.getElementById("normal-game");

// Construct Hero Stats ////////////////////////////////////////
const nameslessHealthBar = document.getElementById("nameless-knight-hp-div");
const namelessID = document.getElementById("nameless-knight");
const namelessKnight = new Hero(
  "Nameless Knight",
  150 /* HP */,
  25 /* DMG */,
  300 /* Main Stat */,
  nameslessHealthBar /* Health Bar */,
  namelessID /* ID Selector */
);
const juliaHealthBar = document.getElementById("julia-the-archer-hp-div");
const juliaID = document.getElementById("julia-the-archer");
const juliaTheArcher = new Hero(
  "Julia the Archer",
  70 /* HP */,
  120 /* DMG */,
  30 /* Main Stat */,
  juliaHealthBar /* Health Bar */,
  juliaID /* ID Selector */
);
const catHealthBar = document.getElementById("the-cat-hp-div");
const catID = document.getElementById("the-cat");
const theCat = new Hero(
  "The Cat",
  50 /* HP */,
  100 /* DMG */,
  400 /* Main Stat */,
  catHealthBar /* Health Bar */,
  catID /* ID Selector */
);
// Construct Boss Stats///////////////////////////////
const bossHealthBar = document.getElementById("big-boss-hp-div");
const bossID = document.getElementById("big-boss");
const bigBoss = new Boss(
  "Big Boss",
  1000 /* HP */,
  20 /* DMG */,
  80 /* Main Stat */,
  false /* Enrage */,
  bossHealthBar /* Health Bar */,
  bossID /* ID Selector */
);
// Construct Monsters///////////////////////////////
const monsterImage = document.getElementById("appearing-monster");
const slime = new Monster("Slime", 50 /* HP */, 10 /* DMG */, monsterImage);
const bat = new Monster("Bat", 30 /* HP */, 20 /* DMG */, monsterImage);

function logStats() {
  console.log(bigBoss);
  console.log(namelessKnight);
  console.log(juliaTheArcher);
  console.log(theCat);
}
function setHealthBar() {
  namelessKnight.healthBar.style.width = "100%";
  juliaTheArcher.healthBar.style.width = "100%";
  theCat.healthBar.style.width = "100%";
  bigBoss.healthBar.style.width = "100%";
}
function updateHealthBar(target) {
  //Health bars are set to 100% width at the start.
  //Max health is refered to as "full health"
  //Then calculate current health, to percentage of full health and set health bar equal to that
  target.healthBar.style.width = `${(target.health / target.maxHealth) * 100}%`;

  //Make sure to not let health drop below 0, and set image to headstone to simulate death
  if (target.health <= 0) {
    target.healthBar.style.width = "0%";
    target.idSelector.src = `./images/headstone.png`;
  }
}
function updateVisuals(attacker, damage, target) {
  outputText.innerHTML += `<p><span class="friendly">${attacker.name}</span> attacks <span class="enemy">${target.name}</span> for <span class="damage">${damage}</span> damage!</p>`;
  //Nudge animation to simulate attacking
  attacker.idSelector.style.transform = "translateX(20px)";
  setTimeout(() => {
    attacker.idSelector.style.transform = "translateX(0px)";
  }, 1000);

  //Flash red to indicate damage taken
  target.idSelector.style.filter = "saturate(100)";
  setTimeout(() => {
    target.idSelector.style.filter = "saturate(1)";
  }, 1000);

  //Dont update health bar for monsters, since they dont have one
  if (target != slime && target != bat) {
    updateHealthBar(target);
  }
  //Instead reset image to portal if monster is killed, and set monsterAlive to false so it can respawn
  if ((target.health <= 0 && target == slime) || target == bat) {
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

  target.health -= damageToTarget;
  console.log("Target health: " + target.health);

  updateVisuals(attacker, damage, target);
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
    outputText.innerHTML += `<p><span class="monster">Monster</span> is preventing you from attacking boss, you must kill <span class="monster">${randomMonster.name}</span> first</p>`;
    autoScroll();
    return monsterAlive, randomMonster;
  }
}

let turnCounter = 0;
function gameLoop() {
  outputText.innerHTML += `<h3>----------------------------- Turn ${turnCounter} -----------------------------</h3>`;
  turnCounter++;
  setTimeout(() => {
    autoScroll();
  }, 200);
  return turnCounter;
}
// Main game loop, will playout a full turn once a hero is clicked
let playerTurn = true;
function playTurn(hero, randomMonster, monsterAlive) {
  // While its the players turn, disable the hero's for 1 second to prevent spam clicking
  if (playerTurn == true) {
    namelessKnight.idSelector.style.pointerEvents = "none";
    juliaTheArcher.idSelector.style.pointerEvents = "none";
    theCat.idSelector.style.pointerEvents = "none";
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
  // Check if damage should apply to boss or monster
  if (target == slime && hero == juliaTheArcher) {
    heroDamage = 0;
    outputText.innerHTML += `<p> <span class="damage">Ranged attacks</span> do nothing vs <span style="monster">${randomMonster.name}</span> is immunevs ranged attacks!</p>`;
  } else if (target == slime && hero == namelessKnight) {
    heroDamage = 0;
    outputText.innerHTML += `<p> <span class="damage">Melee attacks</span> do nothing vs <span style="monster">${randomMonster.name}</span> is immune to melee attacks!</p>`;
  }
  if (target == bat && hero == theCat) {
    heroDamage = 0;
    outputText.innerHTML += `<p> <span class="damage">Magic attacks</span> do nothing vs <span style="monster">${randomMonster.name}</span> is immune to magic attacks!</p>`;
  } else if (target == bat && hero == namelessKnight) {
    heroDamage = 0;
    outputText.innerHTML += `<p> <span class="damage">Melee attacks</span> do nothing vs <span style="monster">${randomMonster.name}</span> is immune to melee attacks!</p>`;
  }
  // Once damage is calculated, apply it to the target
  attack(hero, heroDamage, target);

  // Automatically have enemy play their turn
  setTimeout(() => {
    //Re-enable hero's, only if their health is not 0
    if (namelessKnight.health != 0) {
      namelessKnight.idSelector.style.pointerEvents = "auto";
    }
    if (juliaTheArcher.health != 0) {
      juliaTheArcher.idSelector.style.pointerEvents = "auto";
    }
    if (theCat.health != 0) {
      theCat.idSelector.style.pointerEvents = "auto";
    }
  }, 3000);
  setTimeout(() => {
    enemyTurn();
  }, 1500);
}

function enemyTurn() {
  let bossDamage = calculateDamage(bigBoss);
  let possibleTargets = [namelessKnight, juliaTheArcher, theCat];

  possibleTargets = possibleTargets.filter((target) => target.health > 0);
  // Randomly select a target from the possible targets array
  let randomTarget =
    possibleTargets[Math.floor(Math.random() * possibleTargets.length)];

  outputText.innerHTML += `<p><span class="enemy">${bigBoss.name}</span> retaliates, hits <span class="friendly">${randomTarget.name}</span> for <span class="damage">${bossDamage}</span> damage!</p>`;
  autoScroll();

  //Animation
  bigBoss.idSelector.style.transform = "translateX(-600px)";
  randomTarget.idSelector.style.filter = "saturate(100)";
  setTimeout(() => {
    bigBoss.idSelector.style.transform = "translateX(0px)";
    randomTarget.idSelector.style.filter = "saturate(1)";
  }, 500);

  //Do Damage and update healthbar
  randomTarget.health -= bossDamage;
  updateHealthBar(randomTarget);
  if (randomTarget.health <= 0) {
    randomTarget.health = 0;
    randomTarget.idSelector.style.pointerEvents = "none";
    outputText.innerHTML += `<p><span class="friendly">${randomTarget.name}</span> has died!</p>`;
  }
  //Check for monster spawn
  if (!monsterAlive) {
    spawnMonster();
  }
  //End turn by handing it over to the player
  setTimeout(() => {
    playerTurn = true;
    //Takes care of tuns, and auto scrolling
    gameLoop();
  }, 2000);
}

setHealthBar();
gameLoop();
// Start Game by clicking on hero
window.onclick = (event) => {
  if (event.target == namelessKnight.idSelector) {
    playTurn(namelessKnight, randomMonster, monsterAlive);
  } else if (event.target == juliaTheArcher.idSelector) {
    playTurn(juliaTheArcher, randomMonster, monsterAlive);
  } else if (event.target == theCat.idSelector) {
    playTurn(theCat, randomMonster, monsterAlive);
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
