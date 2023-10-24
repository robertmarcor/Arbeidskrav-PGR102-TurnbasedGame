//
//  Game where heroes can fight a boss, and supports can assist in battle
//  Game ends if Boss reaches 0 health, or if all heroes reach 0 health
//  Game is auto turn based, each turn is started by the player.
//  The enemy will always do their turn after the player.
//
//  Known bugs: always healing lowest health value target, even when full health
//
//Characters are constructed with name, health, damage, mainStat, healthBar, idSelector
//Imports from Character Constructor

console.log("Version 1.0");
import { Hero } from "./characterStats.js";
import { Support } from "./characterStats.js";
import { Boss } from "./characterStats.js";
import { Monster } from "./characterStats.js";

//Audio Selectors
const bgm = document.getElementById("bgm");
bgm.volume = 0.1;

const swordSFX = document.getElementById("slash-sound");
swordSFX.volume = 0.8;
const stompSFX = document.getElementById("stomp-sound");
stompSFX.volume = 0.5;
const healSFX = document.getElementById("heal-sound");
healSFX.volume = 0.5;
const arrowSFX = document.getElementById("arrow-sound");
arrowSFX.volume = 0.5;
const fireStrikeSFX = document.getElementById("fire-strike-sound");
fireStrikeSFX.volume = 0.5;
const hitSFX = document.getElementById("hit-sound");
hitSFX.volume = 0.5;
const superHitSFX = document.getElementById("super-hit-sound");
superHitSFX.volume = 0.5;
const meteorStrikeSFX1 = document.getElementById("meteor1");
meteorStrikeSFX1.volume = 0.5;
const meteorStrikeSFX2 = document.getElementById("meteor2");
meteorStrikeSFX2.volume = 0.5;
const victorySFX = document.getElementById("victory-sound");
victorySFX.volume = 0.5;

//Selectors
const outputText =
  document.getElementById("output-div"); /* Text Box below, Combat Logs */
const gameContainer = document.getElementById("container"); /* Game window */
// * Menu Div for stats btn*/
const menuDiv = document.getElementById("menu-div");
const modal = document.getElementById("modal-div");
const showStatsBtn = document.getElementById("show-stats");
const modalContent = document.getElementById("modal-content");
const modalCloseBtn = document.getElementById("modal-close-btn");

// Graphics
const arrowText = document.getElementById("arrow-div-text");
const arrowGFX = document.getElementById("arrow");
const swordSlashGFX = document.getElementById("knight-slash");
const fireStrikeGFX = document.getElementById("fire-strike");
const crackedEarth = document.getElementById("ground-stomp");
const explosionGFX = document.getElementById("explosion");

// Variables
let playerTurn = true;
let monsterAlive = false;
let randomMonster;
let turnCounter = 1;
let timeBetweenTurns = 1500;
// Construct Heroes, everone is constructed to be targetd via game functions
// Example. hero.damage, target.health, etc.
const nameslessHealthBar = document.getElementById("nameless-knight-hp-div");
const namelessHealthBarText = document.getElementById(
  "nameless-knight-hp-text"
);

const namelessID = document.getElementById("nameless-knight");
const namelessKnight = new Hero(
  "Nameless Knight",
  500 /* HP */,
  50 /* DMG */,
  150 /* Main Stat */,
  nameslessHealthBar /* Health Bar */,
  namelessHealthBarText /* Health Bar Text */,
  namelessID /* ID Selector */,
  "knight.png" /* Image */
);

const juliaHealthBar = document.getElementById("julia-the-archer-hp-div");
const juliaHealthBarText = document.getElementById("julia-the-archer-hp-text");
const juliaID = document.getElementById("julia-the-archer");
let juliaArrows = 4; /* Julia Ammunition for doing attacks */
const juliaTheArcher = new Hero(
  "Julia the Archer",
  300 /* HP */,
  100 /* DMG */,
  20 /* Main Stat */,
  juliaHealthBar /* Health Bar */,
  juliaHealthBarText /* Health Bar Text */,
  juliaID /* ID Selector */,
  "julia-the-archer.png" /* Image */
);

const catHealthBar = document.getElementById("the-cat-hp-div");
const catHealthBarText = document.getElementById("the-cat-hp-text");
const catID = document.getElementById("the-cat");
const theCat = new Hero(
  "The Cat",
  200 /* HP */,
  60 /* DMG */,
  100 /* Main Stat */,
  catHealthBar /* Health Bar */,
  catHealthBarText /* Health Bar Text */,
  catID /* ID Selector */,
  "cat.png" /* Image */
);

// Construct Support Stats/////////////////////////////////////
const williamManaBar = document.getElementById("william-the-healer-mana-div");
const williamManaBarText = document.getElementById(
  "william-the-healer-mana-text"
);

const williamID = document.getElementById("william-the-healer");
const williamTheHealer = new Support(
  "William the Healer",
  80 /* Mana */,
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
  1200 /* HP */,
  25 /* DMG */,
  110 /* Main Stat */,
  false /* Enrage, becomes stronger under certain thresholds */,
  bossHealthBar /* Health Bar */,
  bossHealthBarText /* Health Bar Text */,
  bossID /* ID Selector */
);

// Construct Monsters///////////////////////////////
const monsterImage = document.getElementById("appearing-monster");
const monsterText = document.getElementById("appearing-monster-text");
const slime = new Monster("Slime", 10 /* HP */, 10 /* DMG */, monsterImage);
const bat = new Monster("Bat", 10 /* HP */, 20 /* DMG */, monsterImage);

// DEBUG
function logStats() {
  console.log(bigBoss);
  console.log(namelessKnight);
  console.log(juliaTheArcher);
  console.log(theCat);
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

// Setting the stage, updating graphics/visuals for players to correspong with character values
function setVisuals() {
  arrowText.innerHTML = `<div>x${juliaArrows}</div>`;
  setHealthBar();
  setManaBar();
}

function autoScroll() {
  outputText.scrollTo({
    top: outputText.scrollHeight,
    behavior: "smooth",
  });
}

function updateHealth(target) {
  //Make sure to not let health drop below 0, and set image to headstone to simulate death
  if (target.health <= 0) {
    target.health = 0;
    outputText.innerHTML += `<p><span class="enemy">${target.name}</span> has died!</p>`;

    target.healthBar.style.width = "0%";
    target.idSelector.src = `./images/headstone.png`;
    disableHero(target);
  }
  //Health bars are set to 100% width at the start.
  //Max health is refered to as "full health"
  //Then calculate current health, to percentage of full health and set health bar equal to that
  target.healthBar.style.width = `${(target.health / target.maxHealth) * 100}%`;
  target.healthBarText.innerHTML = `<p>HP: ${target.health} / ${target.maxHealth}</p>`;
}

function healthRegen() {
  // let healthRegen = 5;
  // for (let hero of [namelessKnight, juliaTheArcher, theCat]) {
  //   //Prevent health from going above max or regen if dead
  //   if (hero.health < 1 && hero.health >= hero.maxHealth) {
  //     return;
  //   } else {
  //     hero.health += Math.floor(Math.random() * healthRegen);
  //     updateHealth(hero);
  //   }
  // }
}

function updateMana(hero, amount) {
  hero.mana += amount;
  // Make sure mana doesnt go above or below max/min
  if (hero.mana <= 0) {
    hero.mana = 0;
  } else if (hero.mana >= hero.maxMana) {
    hero.mana = hero.maxMana;
  }
  hero.manaBar.style.width = `${(hero.mana / hero.maxMana) * 100}%`;
  hero.manaBarText.innerHTML = `<p>Mana: ${hero.mana} / ${hero.maxMana}</p>`;
}

function manaRegen() {
  for (let hero of [williamTheHealer, jackTheLumberjack]) {
    // Prevent mana from going above max
    if (hero.mana >= hero.maxMana) {
      hero.mana = hero.maxMana;
    } else {
      updateMana(hero, hero.manaRegen);
    }
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

//
/* ANIMATIONS */
//
function juliaAnim() {
  arrowGFX.style.display = "block";
  arrowSFX.play();
  setTimeout(() => {
    arrowGFX.style.transform = "translateX(600px)";
  }, 300);
  setTimeout(() => {
    arrowGFX.style.transform = "translateX(0px)";
    arrowGFX.style.display = "none";
  }, 1000);
}

function theCatAnim() {
  fireStrikeGFX.style.display = "block";
  fireStrikeSFX.play();
  setTimeout(() => {
    fireStrikeGFX.style.transform = "translateX(450px)";
  }, 300);
  setTimeout(() => {
    fireStrikeGFX.style.transform = "translateX(0px)";
    fireStrikeGFX.style.display = "none";
  }, 1000);
}

function bossAnim(move, bossDamage) {
  if (move == "stomp") {
    outputText.innerHTML += `<p><span class="enemy">${bigBoss.name}</span> stomps the ground, dealing <span class="damage">${bossDamage}</span> damage to everyone!</p>`;
    bigBoss.idSelector.style.transform = "translateX(-520px)";
    setTimeout(() => {
      bigBoss.idSelector.style.transform = "translate(-520px, -200px)";
    }, 900);
    setTimeout(() => {
      bigBoss.idSelector.style.transform = "translate(-520px, 20px)";
      crackedEarth.style.display = "block";
      stompSFX.play();
    }, 1000);
    setTimeout(() => {
      crackedEarth.style.display = "none";
      bigBoss.idSelector.style.transform = "translate(0px, 0px) rotate(0deg)";
      superHitSFX.play();
    }, 3000);
  } else if (move == "meteorStrike") {
    outputText.innerHTML += `<p><span class="enemy">${bigBoss.name}</span> flies up in the air crashing down for <span class="damage">${bossDamage}</span>. BIG damage to everyone!</p>`;
    meteorStrikeSFX1.play();
    setTimeout(() => {
      bigBoss.idSelector.style.animation = "meteorStrike 2s ease-in";
    }, 1000);
    setTimeout(() => {
      explosionGFX.style.display = "block";
    }, 2000);
    setTimeout(() => {
      bigBoss.idSelector.style.animation = "";
      superHitSFX.play();
      explosionGFX.style.display = "none";
    }, 3000);
  } else {
    bigBoss.idSelector.style.transform = "translateX(-520px) rotate(20deg)";
    setTimeout(() => {
      bigBoss.idSelector.style.transform = "translateX(0px)";
    }, 300);
  }
  hitSFX.play();
}
//
/* END ANIMATIONS */
//

// Enable and Disable interactions with characters
function disableHero(hero) {
  hero.idSelector.style.pointerEvents = "none";
}
function activateHero(hero) {
  hero.idSelector.style.pointerEvents = "auto";
}

function disableAllHeros() {
  for (let character of [
    namelessKnight,
    juliaTheArcher,
    theCat,
    williamTheHealer,
    jackTheLumberjack,
  ]) {
    disableHero(character);
  }
}
function ActivateAllHeros() {
  // Dont activate dead hero's
  for (let hero of [namelessKnight, juliaTheArcher, theCat]) {
    if (hero.health != 0) {
      activateHero(hero);
    }
  }
  // Supports dont have HP
  for (let support of [williamTheHealer, jackTheLumberjack]) {
    activateHero(support);
  }
}

function updateVisuals(attacker, damage, target) {
  // Arrow counter for Julia
  if (juliaArrows <= 0) {
    arrowText.innerHTML = `<div>x0</div>`;
    outputText.innerHTML += `<p> <span class="friendly">${juliaTheArcher.name}</span> is out of arrows, damage will be reduced</p>`;
  }

  outputText.innerHTML += `<p><span class="friendly">${attacker.name}</span> attacks <span class="enemy">${target.name}</span> for <span class="damage">${damage}</span> damage!</p>`;

  if (target.enrage == true) {
    outputText.innerHTML += `<p><span class="enemy">${
      target.name
    }</span> receives ${Math.floor(damage * 0.8)} enrage incomming damage, ${
      target.health
    } remaining health after attack</p>`;
  } else {
    outputText.innerHTML += `<p><span class="enemy">${target.name}</span> receives ${damage} incomming damage, ${target.health} remaining health after attack</p>`;
  }

  //Flash to indicate damage taken
  damageTakenAnimation(target);

  //Dont update health bar for monsters, since they dont have one
  if (target != slime && target != bat) {
    updateHealth(target);
  }
  //Instead reset image to portal if monster is killed, and set monsterAlive to false so it can respawn
  else if (
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
// Attack function to select and damage a target
function attack(attacker, damage, target) {
  let damageToTarget = damage;
  // Check if target is enraged,then reduce damage by 20%
  if (target.enrage == true) {
    damageToTarget = Math.floor(damageToTarget * 0.8);
    outputText.innerHTML += `<p><span class="enemy">${target.name}</span> is enraged, damage is reduced by 20%</p>`;
  }

  //Damage is done after check
  target.health -= damageToTarget;
  updateVisuals(attacker, damage, target);
}

function healTarget(target, amount) {
  // Revive target if dead, and reset image from headstone to character
  if (target.health <= 5) {
    outputText.innerHTML += `<p><span class="friendly">${target.name}</span> has been resurrected</p>`;
    activateHero(target);
    target.idSelector.src = `./images/${target.image}`;
  } else {
    outputText.innerHTML += `<p><span class="friendly">${williamTheHealer.name}</span> heals <span class="friendly">${target.name}</span> for <span class="heal">${amount}</span> HP`;
  }
  target.health += amount;
  let doubleCast = Math.random() * 1;

  if (doubleCast < 0.25) {
    outputText.innerHTML += `<p><span class="friendly">${williamTheHealer.name}</span> was inpired, and casts another heal!</p> `;
    setTimeout(healTarget(target, amount), 2000);
  } else if (target.health < 25 && doubleCast < 0.5) {
    outputText.innerHTML += `<p><span class="friendly">${williamTheHealer.name}</span> was inpired, and casts another heal!</p> `;
    setTimeout(healTarget(target, amount), 2000);
  }

  // Health set to max if overhealed
  if (target.health >= target.maxHealth) {
    target.health = target.maxHealth;
  }
  updateHealth(target);

  //Effects
  healSFX.play();
  target.idSelector.style.filter =
    "brightness(100) sepia(100) saturate(10) hue-rotate(40deg)";
  setTimeout(() => {
    target.idSelector.style.filter = "";
  }, 150);
  autoScroll();
}
function craftArrows(amount) {
  juliaArrows += amount;
  arrowText.innerHTML = `<div>x${juliaArrows}</div>`;
  outputText.innerHTML += `<p><span class="friendly">${jackTheLumberjack.name}</span> crafts ${amount} arrows for <span class="friendly">${juliaTheArcher.name}</span></p>`;
  autoScroll();
  return juliaArrows;
}
// Used to calculate heal amount and find lowest health ally
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
  updateMana(williamTheHealer, -manaCost);
}
function jackCraft() {
  const allyArchers = [juliaTheArcher];

  const craftPower = jackTheLumberjack.baseStat;
  const craftMulti = jackTheLumberjack.supportMultiplier;
  const craftAmount = craftPower * craftMulti;
  const manaCost = 50;
  craftArrows(craftAmount);
  updateMana(jackTheLumberjack, -manaCost);
}

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
// Make boss stronger
function enrage() {
  outputText.innerHTML += `<p><span class="enemy">${bigBoss.name}</span> HAS ENRAGED!</p>`;
  outputText.innerHTML += `<p>Attacks will be more powerfull, and <span class="enemy">${bigBoss.name}</span> will endure more damage</p>`;
  bigBoss.enrage = true;
  bigBoss.damage = 50;
  bigBoss.mainStat = 150;
  bigBoss.idSelector.style.transform = "translateY(-20px) scale(1.2)";
  bigBoss.idSelector.style.filter =
    "brightness(100%) sepia(100%) saturate(100%) hue-rotate(-60deg)";
}

// Main game loop, will playout a full turn once a hero is clicked
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
    heroDamage = Math.floor(heroDamage * 0.2); /* Reduce damage by 80% */
  }

  // Check if damage should apply to monster
  if (target == slime || target == bat) {
    if (target == slime && hero == juliaTheArcher) {
      heroDamage = 1;
      outputText.innerHTML += `<p>Arrows are not very effective vs <span class="monster">${randomMonster.name}</span></p>`;
    } else if (target == slime && hero == namelessKnight) {
      heroDamage = 1;
      outputText.innerHTML += `<p>Melee attacks are not very effective vs <span style="monster">${randomMonster.name}</span></p>`;
    }
    if (target == bat && hero == theCat) {
      heroDamage = 1;
      outputText.innerHTML += `<p>Magic attacks are not very effective vs <span style="monster">${randomMonster.name}</span></p>`;
    } else if (target == bat && hero == namelessKnight) {
      heroDamage = 1;
      outputText.innerHTML += `<p>Melee attacks are not very effective vs <span style="monster">${randomMonster.name}</span></p>`;
    }
  }
  // Once damage is calculated, apply it to the target
  attack(hero, heroDamage, target);

  // Automatically have enemy play their turn
  setTimeout(enemyTurn, timeBetweenTurns);
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

  setTimeout(enemyTurn, timeBetweenTurns);
}

function enemyTurn() {
  // End game if boss is dead, prevent enemy turn from the grave
  if (bigBoss.health <= 0) {
    gameOver("win");
  }
  // play the game like normal if boss is alive
  else if (bigBoss.health > 0) {
    let bossDamage = calculateDamage(bigBoss);
    let possibleTargets = [namelessKnight, juliaTheArcher, theCat];

    // Filter out dead targets
    possibleTargets = possibleTargets.filter((target) => target.health > 0);
    // Randomly select a target from the possible targets array
    let randomTarget =
      possibleTargets[Math.floor(Math.random() * possibleTargets.length)];
    // Randomly select a move from the possible moves array
    /* Only 1 move exists as of writing, default attack is used unless move exists */
    let moves = ["stomp", "kick", "punch", "rage", "slam", "meteorStrike"];
    let move = moves[Math.floor(Math.random() * moves.length)];

    if (move == "stomp") {
      bossDamage = Math.floor(bossDamage * 0.5);
      bossAnim(move, bossDamage);
      //Sync damage with Animation
      setTimeout(() => {
        for (let target of possibleTargets) {
          target.health -= bossDamage;
          if (target.health <= 0) {
            target.health = 0;
          }
          updateHealth(target);
          damageTakenAnimation(target);
        }
      }, 3000);
    } else if (move == "meteorStrike") {
      bossDamage = Math.floor(bossDamage * 2);
      bossAnim(move, bossDamage);
      //Sync damage with Animation
      setTimeout(() => {
        for (let target of possibleTargets) {
          target.health -= bossDamage;
          if (target.health <= 0) {
            target.health = 0;
          }
          meteorStrikeSFX2.play();
          updateHealth(target);
          damageTakenAnimation(target);
        }
      }, 3000);
    } else {
      /* Regular Attack */
      outputText.innerHTML += `<p><span class="enemy">${bigBoss.name}</span> retaliates, hits <span class="friendly">${randomTarget.name}</span> for <span class="damage">${bossDamage}</span> damage!</p>`;
      bossAnim(move, randomTarget, bossDamage);
      randomTarget.health -= bossDamage;
      damageTakenAnimation(randomTarget);
      updateHealth(randomTarget);
      if (randomTarget.health <= 0) {
        randomTarget.health = 0;
      }
    }
    autoScroll();

    //Do Damage and update healthbar
    //Check for monster spawn
    if (!monsterAlive) {
      setTimeout(spawnMonster, timeBetweenTurns);
    }
    //End turn by handing it over to the player
    setTimeout(() => {
      playerTurn = true;
      ActivateAllHeros();
      //Takes care of tuns, and auto scrolling
      gameLoop();
    }, timeBetweenTurns);
  }
}
setVisuals();
disableHero(williamTheHealer);
disableHero(jackTheLumberjack);

function gameOver(result) {
  gameContainer.style.display = "none";
  menuDiv.style.display = "none";
  outputText.style.maxHeight = "100vh";
  outputText.style.height = "100%";
  outputText.style.maxWidth = "100vw";
  outputText.style.width = "100%";
  if (result == "win") {
    outputText.innerHTML += `<h1>Game Over</h1>`;
    outputText.innerHTML += `<p>Big Boss has been defeated!</p>`;
    outputText.innerHTML += `<p>It took you ${turnCounter} turns to defeat Big Boss!</p>`;
    outputText.innerHTML += `<h2>You Win!</h2>`;
    victorySFX.play();
  } else if (result == "lose") {
    outputText.innerHTML += `<h1>Game Over</h1>`;
    outputText.innerHTML += `<p>Big Boss has defeated you!</p>`;
    outputText.innerHTML += `<p>You Lose!</p>`;
  }
  bgm.pause();
  disableAllHeros();
}

function gameLoop() {
  let gameState = "";

  // Check if all hero's are dead, if yes, end game
  if (
    juliaTheArcher.health <= 0 &&
    namelessKnight.health <= 0 &&
    theCat.health <= 0
  ) {
    gameState = "lose";
    gameOver(gameState);
  }
  // Check if boss is dead, if yes, end game
  if (bigBoss.health <= 0) {
    gameState = "win";
    gameOver(gameState);
  }
  // Check if boss is below 20% health, if yes, enrage
  else if (bigBoss.health < 0.2 * bigBoss.maxHealth) {
    enrage();
  }

  //Disable supports if they are out of mana
  for (let support of [williamTheHealer, jackTheLumberjack]) {
    if (support.mana <= 0) {
      outputText.innerHTML += `<p> <span class="friendly">${support.name}</span> is out of mana, he can no longer help!</p>`;
      outputText.innerHTML += `<p> Wait for him to regain to full</p>`;
      disableHero(support);
    }
  }
  manaRegen();
  healthRegen();

  outputText.innerHTML += `<hr> <h3> Turn ${turnCounter}</h3> <hr>`;

  turnCounter++;
  setTimeout(autoScroll, 200);
  return turnCounter;
}

// Start Game by clicking on hero
window.onclick = (event) => {
  bgm.play();
  //Checks for user clicks, if user clicks on a hero, play their turn
  //Knight Turn
  if (event.target == namelessKnight.idSelector) {
    swordSlashGFX.style.display = "block";
    swordSFX.play();
    setTimeout(() => {
      gameContainer.style.backgroundImage = "url('./images/bg.jpg')";
      swordSlashGFX.style.display = "none";
    }, 300);
    playTurn(namelessKnight, randomMonster, monsterAlive);
  }
  // Julias Turn
  else if (event.target == juliaTheArcher.idSelector) {
    if (juliaArrows <= 0) {
      outputText.innerHTML += `<p> <span class="friendly">${juliaTheArcher.name}</span> is out of arrows, click Jack to craft more</p>`;
      autoScroll();
      return;
    }
    juliaArrows -= 1;
    arrowText.innerHTML = `<div>x${juliaArrows}</div>`;
    playTurn(juliaTheArcher, randomMonster, monsterAlive);
    juliaAnim();
  }
  //Cat Turn
  else if (event.target == theCat.idSelector) {
    playTurn(theCat, randomMonster, monsterAlive);
    theCatAnim();
  }
  //Suppports
  // William The Healer
  else if (event.target == williamTheHealer.idSelector) {
    if (williamTheHealer.mana >= 20) {
      supportTurn(williamTheHealer);
    } else {
      outputText.innerHTML += `<p> <span class="friendly">${williamTheHealer.name}</span> is out of mana, healing costs 20MP</p>`;
      autoScroll();
    }
  }
  // Jack The Lumberjack
  else if (event.target == jackTheLumberjack.idSelector) {
    if (jackTheLumberjack.mana >= 50) {
      supportTurn(jackTheLumberjack);
    } else {
      outputText.innerHTML += `<p> <span class="friendly">${jackTheLumberjack.name}</span> is out of mana, crafting arrows cost 50MP</p>`;
      autoScroll();
    }
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
