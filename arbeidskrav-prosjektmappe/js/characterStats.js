export class Hero {
  constructor(name, health, damage, mainStat, healthBar, idSelector) {
    this.name = name;
    this.health = health;
    this.damage = damage;
    this.mainStat = mainStat;
    this.healthBar = healthBar;
    this.idSelector = idSelector;
    this.maxHealth = health; /* Needed to reference original starting HP */
  }
}
//Boss
export class Boss {
  constructor(name, health, damage, mainStat, enrage, healthBar, idSelector) {
    this.name = name;
    this.health = health;
    this.damage = damage;
    this.mainStat = mainStat;
    this.enrage = enrage;
    this.healthBar = healthBar;
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
