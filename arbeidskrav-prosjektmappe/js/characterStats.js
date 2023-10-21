// Hero
export class Hero {
  constructor(
    name,
    health,
    damage,
    mainStat,
    healthBar,
    healthBarText,
    idSelector,
    image
  ) {
    this.name = name;
    this.health = health;
    this.damage = damage;
    this.mainStat = mainStat;
    this.healthBar = healthBar;
    this.idSelector = idSelector;
    this.healthBarText = healthBarText;
    this.maxHealth = health; /* Needed to reference original starting HP */
    this.image = image;
  }
}
// Support
export class Support {
  constructor(
    name,
    mana,
    manaRegen,
    baseStat,
    supportMultiplier,
    manaBar,
    manaBarText,
    idSelector
  ) {
    this.name = name;
    this.mana = mana;
    this.manaRegen = manaRegen;
    this.baseStat = baseStat;
    this.supportMultiplier = supportMultiplier;
    this.manaBar = manaBar;
    this.manaBarText = manaBarText;
    this.idSelector = idSelector;
    this.maxMana = mana; /* Needed to reference original starting mana */
  }
}
//Boss
export class Boss {
  constructor(
    name,
    health,
    damage,
    mainStat,
    enrage,
    healthBar,
    healthBarText,
    idSelector
  ) {
    this.name = name;
    this.health = health;
    this.damage = damage;
    this.mainStat = mainStat;
    this.enrage = enrage;
    this.healthBar = healthBar;
    this.healthBarText = healthBarText;
    this.idSelector = idSelector;
    this.maxHealth = health; /* Needed to reference original starting HP */
  }
}
export class Monster {
  constructor(name, health, damage, idSelector) {
    this.name = name;
    this.health = health;
    this.maxHealth = health;
    this.damage = damage;
    this.idSelector = idSelector;
  }
}
