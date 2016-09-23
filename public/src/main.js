class Maps extends React.Component {

  constructor() {
    super();

    this.state = {
      mapArr: []
    };
  }

  componentWillMount() {
    this._createNewGame();
  }

  componentDidMount() {
    window.addEventListener('keydown', this._handleKeyDown.bind(this));
  }

  render() {
    let that = this;
    const center = this.state.playerLoc;
    let mapArr = this.state.mapArr;
    let lvl = this.state.gameLvl;
    let toMap = [];
    for (var i = center[1] - 3; i <= center[1] + 3; i++) {
      let section = mapArr[i].slice(center[0] - 3, center[0] + 4);
      toMap.push(section);
    }
    var rows = toMap.map(function(item, i) {
      var entry = item.map(function(element, j) {
        if (element === "E" || element === "R") {
          return (<Board info={element} index={j} />)
        } else if (element.type === "player") {
          return (<Board info={element.type} code={that.state.attack.code} index={j} direction={that.state.direction}/>);
        } else {
          if (element.type === "enemy") {}
          return (<Board info={element.type || "missing"} code={element.code || null} index={j}/>);
        }
      });
      return (
        <div className={"boardRow row"+i + " level" + lvl %2} key={i}>{entry}</div>
      );
    });
    let buttons = [<button className="arrowBtn" onClick={this._handleClick.bind(this, {keyCode: 37})}><i className="fa fa-arrow-left"></i></button>,
      <button className="arrowBtn" onClick={this._handleClick.bind(this, {keyCode: 38})}><i className="fa fa-arrow-up"></i></button>,
      <button className="arrowBtn" onClick={this._handleClick.bind(this, {keyCode: 40})}><i className="fa fa-arrow-down"></i></button>,
      <button className="arrowBtn" onClick={this._handleClick.bind(this, {keyCode: 39})}><i className="fa fa-arrow-right"></i></button>
    ];
    if (this.state.diffWeapon) {
      buttons = [<button className="dualBtn" onClick={this._handleClick.bind(this, {keyCode: 89})}>Yes</button>,
        <button className="dualBtn" onClick={this._handleClick.bind(this, {keyCode: 78})}>No</button>
      ];
    } else if (!this.state.playing) {
      buttons = [<button className="dualBtn" onClick={this._handleClick.bind(this, {keyCode: 70})}>Fast Restart</button>,
        <button className="dualBtn" onClick={this._handleClick.bind(this, {keyCode: 82})}>Restart</button>
      ];
    }

    return (
      <div>
      <div className="header">
        <Header level={this.state.level} currentHealth={this.state.currentHealth} maxHealth={this.state.maxHealth} attack={this.state.attack.display} attackLvl={this.state.attackLvl} treasure={this.state.treasure} xp={this.state.xp} nextLevel={this.state.nextLevel} healthRem={this.state.healthRem} treasureRem={this.state.treasureRem} enemiesRem={this.state.enemiesRem} weaponsRem={this.state.weaponsRem} unlock={this.state.unlockLvl} boss={this.state.boss}/>
        </div>
        <div className="game row">
      <div className="map col-xs-12 col-md-offset-4 col-md-4">
        {rows}
        <div className="buttonContainer">
          {buttons}
        </div>
      </div>
          <div className="sidebar col-md-4 col-xs-10 col-xs-offset-1 col-md-offset-0">
            <Journal entries={this.state.entries}/>
            </div>
        </div>
        </div>
    )
  }
  _createNewGame() {
    let newMap = map(1);
    this.setState({
      mapArr: newMap[0],
      playerLoc: newMap[1],
      level: 1, //player's level
      maxHealth: 30,
      currentHealth: 30,
      attack: {
        type: "weapon",
        display: "Melee",
        code: "sharp",
        name: "Claw Sharpener",
        effect: "A stone to sharpen your claws. Using this item will increase your melee attack power.",
        damage(weaponLvl, dragonLvl) {
          let weaponLvls = [3, 4, 6];
          dragonLvl--;
          return Math.floor(weaponLvls[weaponLvl - 1] * .5) * dragonLvl + this._getRandom(1, weaponLvls[weaponLvl - 1]);
        },
        attackEffect(weaponLvl) {
          return false;
        }
      },
      attackLvl: 1, //weapon's level
      treasure: 0,
      xp: 0,
      nextLevel: 20,
      weaponsRem: 4,
      treasureRem: 12,
      healthRem: 6,
      enemiesRem: 15,
      entries: ["Troubling things have been happening in your cave - random people have invaded, stealing your treasure! Reclaim your treasure and beat the invaders to win!"],
      gameLvl: 1,
      diffWeapon: false,
      playing: true, //is game active?
      boss: false,
      unlockLvl: 100,
      won: false,
      direction: "up"
    });
  }
  _createNextLevel(gameLvl, currentHealth, attack, attackLvl, treasure, entries, unlockLvl) {
    let newMap = map(gameLvl || 1);
    this.setState({
      mapArr: newMap[0],
      playerLoc: newMap[1],
      currentHealth: currentHealth || 30,
      attack: attack || {
        type: "weapon",
        display: "Melee",
        name: "Claw Sharpener",
        effect: "A stone to sharpen your claws. Using this item will increase your melee attack power.",
        weaponLvl: [3, 4, 6],
        damage(weaponLvl, dragonLvl) {
          dragonLvl--;
          return Math.floor(this.weaponLvl[weaponLvl - 1] * .5) * dragonLvl + this._getRandom(1, this.weaponLvl[weaponLvl - 1]);
        },
        attackEffect(weaponLvl) {
          return false;
        },
        _getRandom(min, max) {
          return Math.floor(Math.random() * (max - min + 1) + min);
        }
      },
      attackLvl: attackLvl || 1,
      treasure: treasure || 0,
      weaponsRem: 4,
      treasureRem: 12,
      healthRem: 6,
      enemiesRem: 15,
      entries: entries || ["Troubling things have been happening in your cave - people have invaded, stealing your treasure! Reclaim your treasure and beat the invaders to win!"],
      gameLvl: gameLvl || 1,
      diffWeapon: false,
      playing: true,
      boss: false,
      unlockLvl: unlockLvl || 100,
      won: false,
      direction: "up"
    });
  }
  _handleKeyDown(e) {
    e.preventDefault();
    this._handleMovement(e);
  }
  _handleClick(key, e) {
    e.preventDefault();
    this._handleMovement(key);
  }
  _handleMovement(e) {
    if (this.state.diffWeapon) { //requires y or n to confirm weapon change
      if (e.keyCode === 89) {
        this._changeWeapon(true);
      } else if (e.keyCode === 78) {
        this._changeWeapon(false);
      }
      return;
    }
    if (!this.state.playing) { //if the game is over
      if (e.keyCode === 82) { //r to restart
        this._createNewGame();
      } else if (e.keyCode === 70) { //f for fast restart
        let t = this.state
        this._createNextLevel(false, false, t.attack, t.attackLvl, false, false, false);
      } else if (this.state.won) {
        this._makeJournalEntry("You won! Wanna play again? Type 'r' to get started!");
        return;
      } else {
        this._makeJournalEntry("You lost! Type 'r' to start a new game or 'f' to restart with your current level and weapon.");
        return;
      }
    }
    const playerLoc = this.state.playerLoc;
    const mapArr = this.state.mapArr;
    let x = playerLoc[0];
    let y = playerLoc[1];
    let newLoc;
    let direction;
    switch (e.keyCode) {
      //move down with arrow or s
      case 40:
      case 83:
        newLoc = mapArr[y + 1][x];
        y++;
        direction = "down";
        break;
        //move up with arrow or w
      case 38:
      case 87:
        newLoc = mapArr[y - 1][x];
        y--;
        direction = "up";
        break;
        //move left with arrow or a
      case 37:
      case 65:
        newLoc = mapArr[y][x - 1];
        x--;
        direction = "left";
        break;
        //move right with arrow or d
      case 39:
      case 68:
        newLoc = mapArr[y][x + 1];
        x++;
        direction = "right";
        break;

      default:
        return;
    }
    if (newLoc === "R") {
      this._movePlayer(x, y, playerLoc, direction);
    } else if (newLoc === "E") {
      return;
    } else if (newLoc.type === "treasure") {
      this._getTreasure(x, y, playerLoc, newLoc, true, direction);
    } else if (newLoc.type === "health") {
      this._getHealth(x, y, playerLoc, newLoc, true, direction);
    } else if (newLoc.type === "weapon") {
      this._getWeapon(x, y, playerLoc, newLoc, true, direction);
    } else if (newLoc.type === "enemy" || newLoc.type === "boss") {
      this._startBattle(x, y, playerLoc, newLoc, direction);
    }
  }
  _getTreasure(x, y, oldLoc, obj, fromPickup, direction) {
    const found = obj.amount(this.state.gameLvl);
    const treasure = this.state.treasure + found;
    const message = "You recover some treasure! Found " + found + " " + obj.name + "!";
    const pickup = fromPickup ? 1 : 0;
    this._makeJournalEntry(message);
    this.setState({
      treasure: treasure,
      treasureRem: this.state.treasureRem - pickup
    });
    if (this.state.treasure >= this.state.unlockLvl && this.state.enemiesRem <= 5 && !this.state.boss) {
      this._getBoss();
    }
    this._movePlayer(x, y, oldLoc, direction);
  }

  _getHealth(x, y, oldLoc, obj, fromPickup, direction) {
    const max = this.state.maxHealth;
    let currentHealth = this.state.currentHealth;
    const health = obj.amount(max);
    let message;
    const pickup = fromPickup ? 1 : 0;
    if (max === currentHealth) {
      message = "You found some yummy food! You eat it, but you're already at full health!";
    } else if (currentHealth < max) {
      if (currentHealth + health > max) {
        message = "You found some yummy food! You eat it and restore " + (max - currentHealth) + " health!";
        currentHealth = max;
      } else {
        currentHealth = currentHealth + health;
        message = "You found some yummy food! You eat it and restore " + health + " health!";
      }
    }
    this._makeJournalEntry(message);
    this.setState({
      currentHealth: currentHealth,
      healthRem: this.state.healthRem - pickup
    });
    this._movePlayer(x, y, oldLoc, direction);
  }
  _changeWeapon(decision) {
    const obj = this.state.diffWeapon;
    let weapon = this.state.attack;
    let level = this.state.attackLvl;
    let message;
    if (decision) {
      weapon = obj.weapon;
      level = 1;
      message = "You decided to switch to " + weapon.name + " level 1.";
    } else {
      message = "You decided to keep your level " + level + " " + this.state.attack.name + " weapon.";
    }
    this._makeJournalEntry(message);
    this.setState({
      attack: weapon,
      attackLvl: level,
      weaponsRem: this.state.weaponsRem - obj.pickup,
      diffWeapon: false
    });
    this._movePlayer(obj.x, obj.y, obj.oldLoc, obj.direction);
  }
  _getWeapon(x, y, oldLoc, obj, fromPickup, direction) {
    let curWeapon = this.state.attack.name;
    const weapon = obj.name;
    let message;
    const pickup = fromPickup ? 1 : 0;
    if (curWeapon === weapon) {
      if (this.state.attackLvl < 3) {
        message = "You've found " + weapon + "! This has increased your weapon's level to " + (this.state.attackLvl + 1) + "!";
        this._makeJournalEntry(message);
        this.setState({
          attack: obj,
          attackLvl: this.state.attackLvl + 1,
          weaponsRem: this.state.weaponsRem - pickup
        });
      } else {
        message = "You've found " + weapon + "! But your weapon is already completely powered up.";
        this._makeJournalEntry(message);
        this.setState({
          weaponsRem: this.state.weaponsRem - pickup
        });
      }
      this._movePlayer(x, y, oldLoc, direction);
    } else {
      message = "You've found " + weapon + "! You currently have " + curWeapon + " level " + this.state.attackLvl + ". Do you want to switch to " + weapon + "? This will reset the level back to 1. Type y or n to confirm.";
      this._makeJournalEntry(message);
      this.setState({
        diffWeapon: {
          weapon: obj,
          x: x,
          y: y,
          oldLoc: oldLoc,
          pickup: pickup,
          direction: direction
        }
      });
    }
  }

  _makeJournalEntry(entry) {
    let entries = this.state.entries;
    if (entries.length >= 5) {
      entries.pop();
    }
    entries.unshift(entry);
    this.setState({
      entries: entries
    });
  }
  Boss(name, code, weakness, resistance, damage, init, gameLvl) {
    this.name = name;
    this.code = code;
    this.type = "boss";
    this.weakness = weakness;
    this.resistance = resistance;
    this.effect = false;
    this.level = gameLvl;
    this.damage = damage;
    this.reward = {
      type: "health",
      name: "Yummy Food",
      amount(max) {
        return Math.floor(max * .1)
      }
    }
    this.init = init;
  }
  _getBoss() {
    let mapArr = this.state.mapArr;
    let location = [];
    let bosses = [{
      name: "Wiley Wizard",
      code: "wizard",
      weakness: "Melee",
      resistance: "Frost Breath",
      damage(level) {
        let damage = level;
        for (let i = 1; i <= level; i++) {
          damage += this._getRandom(1, 6);
        }
        return damage;
      },
      init: function() {
        this.hp = this.level * 6 + 6;
        return this;
      }
    }, {
      name: "Rampaging Regent",
      code: "regent",
      weakness: "Acid Breath",
      resistance: "Fire Breath",
      damage(level) {
        let damage = 0;
        for (let i = 1; i <= level; i++) {
          damage += this._getRandom(1, 6);
        }
        return damage;
      },
      init: function() {
        this.hp = this.level * 8 + 8;
        return this;
      }
    }, {
      name: "Naughty Knight",
      code: "knight",
      weakness: "Shock Attack",
      resistance: "Melee",
      damage(level) {
        let damage = level;
        for (let i = 1; i <= level; i++) {
          damage += this._getRandom(1, 5);
        }
        return damage;
      },
      init: function() {
        this.hp = this.level * 8 + 8;
        return this;
      }
    }, {
      name: "Titanic Tyrant",
      code: "tyrant",
      weakness: false,
      resistance: false,
      damage(level) {
        let damage = 0;
        for (let i = 1; i <= level; i++) {
          damage += this._getRandom(1, 10);
        }
        return damage;
      },
      init: function() {
        this.hp = this.level * 10 + 10;
        return this;
      }
    }]
    let s = bosses[this.state.gameLvl - 1];
    let boss = new this.Boss(s.name, s.code, s.weakness, s.resistance, s.damage, s.init, this.state.gameLvl + 1);
    boss.init();
    while (location.length < 1) {
      //return Math.floor(Math.random() * (max - min + 1) + min);
      let x = Math.floor(Math.random() * (mapArr[0].length - 1) + 1);
      let y = Math.floor(Math.random() * (mapArr.length - 1) + 1);
      if (mapArr[y][x] === "R") {
        mapArr[y][x] = boss;
        this.setState({
          mapArr: mapArr,
          boss: true
        });
        location.push(boss); //this controls the loop.
      }
    }
    this._makeJournalEntry("The boss of this level has appeared. Search for it if you dare...");
  }
  _startBattle(x, y, playerLoc, obj, direction) {
    let that = this;
    const attack = this.state.attack;
    let damagePlayer;
    let enemyHP = obj.hp;
    let enemyEffect = obj.effect;
    let currentHealth = this.state.currentHealth;

    //calculate damage to enemy
    let damageEnemy = attack.damage.call(that, this.state.attackLvl, this.state.level);
    let message = "You encounter the " + obj.name + "! You use " + attack.display + " to inflict ";
    if (attack.display === obj.resistance) {
      damageEnemy = Math.floor(damageEnemy * .5);
      message += damageEnemy + " damage! The enemy is resistant to " + attack.display + ", so the damage was halved! ";
    } else if (attack.display === obj.weakness) {
      damageEnemy = damageEnemy * 2;
      message += damageEnemy + " damage! The enemy is weak to " + attack.display + ", so the damage was doubled! ";
    } else {
      message += damageEnemy + " damage! ";
    }
    enemyHP -= damageEnemy;

    //did a weapon effect occur?
    let chance = attack.attackEffect.call(that, this.state.attackLvl);
    if (chance) {
      if (!enemyEffect) {
        if (attack.display === "Acid Breath") {
          enemyEffect = [attack.display, 1];
        } else {
          enemyEffect = attack.display;
        }
      } else {
        let num = enemyEffect[1];
        enemyEffect = [attack.display, num++];
      }
    }

    if (enemyEffect[0] === "Acid Breath") {
      let specDamage = 0;
      for (let i = 1; i <= enemyEffect[1]; i++) {
        specDamage += that._getRandom(1, 3);
      }
      enemyHP -= specDamage;
      message += " The enemy suffers an extra " + specDamage + " damage due to poison!";
    }

    if (enemyEffect === "Frost Breath" && enemyHP > 0) {
      message += " The enemy was frozen by your attack! They are unable to attack this turn!";
      let mapArr = this.state.mapArr;
      mapArr[y][x].hp = enemyHP;
      this.setState({
        mapArr: mapArr,
      });
      this._makeJournalEntry(message);
    } else if (enemyHP > 0) { //enemy survived attack, calculate damage to player
      damagePlayer = obj.damage.call(that, obj.level);
      if (enemyEffect === "Shock Attack") {
        damagePlayer = Math.floor(damagePlayer * .5);
        message += " The enemy is still dazed from your attack-its attack is halved! The " + obj.name + " attacks, inflicting " + damagePlayer + "!";
        enemyEffect = false;
      } else {
        message += " The " + obj.name + " attacks, inflicting " + damagePlayer + "!";
      }
      currentHealth -= damagePlayer;

      if (currentHealth <= 0) { //enemy defeats player
        message += " The enemy has defeated you. You lose. Type 'r' to start a new game or 'f' to restart with your current level and weapon.";
        currentHealth = 0;
        this.setState({
          playing: false
        });
      }
      let mapArr = this.state.mapArr;
      mapArr[y][x].hp = enemyHP;
      mapArr[y][x].effect = enemyEffect;
      this.setState({
        mapArr: mapArr,
        currentHealth: currentHealth
      });
      this._makeJournalEntry(message);
    } else { //enemy did not survive attack
      let experience = obj.level;
      message += " You have defeated the " + obj.name + " and gained " + experience + " experience!";
      this._makeJournalEntry(message);
      this.setState({
        xp: this.state.xp + experience,
        currentHealth: currentHealth,
        enemiesRem: this.state.enemiesRem - 1
      });
      if (this.state.xp >= this.state.nextLevel) { //level up?
        this._levelUp();
      }
      if (this.state.treasure >= this.state.unlockLvl && this.state.enemiesRem <= 5 && !this.state.boss) { //create boss?
        this._getBoss();
      }
      if (obj.reward.type === "treasure") { //get reward for defeating enemy
        this._getTreasure(x, y, playerLoc, obj.reward, false, direction);
      } else if (obj.reward.type === "weapon") {
        this._getWeapon(x, y, playerLoc, obj.reward, false, direction);
      } else if (obj.reward.type === "health") {
        this._getHealth(x, y, playerLoc, obj.reward, false, direction);
      }
      if (obj.type === "boss") { //defeated boss? Check game completion/next game level.
        if (this.state.treasure >= 1000) {
          this._makeJournalEntry("You have defeated the invaders and retrieved your treasure! You win!!");
          this.setState({
            won: true,
            playing: false
          });
        } else {
          this._makeJournalEntry("You have defeated the boss! On to the next level!");
          let t = this.state;
          let unlockLvl = t.unlockLvl + 100 * (t.gameLvl + 1);
          this._createNextLevel(t.gameLvl + 1, t.currentHealth, t.attack, t.attackLvl, t.treasure, t.entries, unlockLvl);
        }
      }
    }
  }
  _levelUp() {
    let currentXP = this.state.xp - this.state.nextLevel;
    let message = "You've leveled up to level " + (this.state.level + 1) + "! Your hp has been fully restored!";
    this.setState({
      xp: currentXP,
      nextLevel: this.state.nextLevel * 2,
      level: this.state.level + 1,
      maxHealth: this.state.maxHealth + 10,
      currentHealth: this.state.maxHealth + 10
    });
    this._makeJournalEntry(message);
  }
  _movePlayer(x, y, oldLoc, direction) {
    let mapArr = this.state.mapArr;
    mapArr[oldLoc[1]][oldLoc[0]] = "R";
    mapArr[y][x] = {
      x: x,
      y: y,
      type: "player"
    }
    this.setState({
      mapArr: mapArr,
      playerLoc: [x, y],
      direction: direction
    });
  }
  _getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}

var map = function(gameLevel) {
  let encyclopedia = {
    treasures: [
      ["Glittering Gold", "gold"],
      ["Radiant Rubies", "rubies"],
      ["Sparkling Silver", "silver"],
      ["Amazing Amethyst", "amethyst"],
      ["Enormous Emeralds", "emeralds"],
      ["Dazzling Diamonds", "diamonds"]
    ],
    weapons: [{
      type: "weapon",
      display: "Melee",
      name: "Claw Sharpener",
      code: "sharp",
      effect: "A stone to sharpen your claws. Using this item will increase your melee attack power.",
      damage(weaponLvl, dragonLvl) {
        let levels = [3, 4, 6];
        dragonLvl--;
        return Math.floor(levels[weaponLvl - 1] * .5) * dragonLvl + this._getRandom(1, levels[weaponLvl - 1]);
      },
      attackEffect(weaponLvl) {
        return false;
      }
    }, {
      type: "weapon",
      display: "Fire Breath",
      name: "Fire Stone",
      code: "fire",
      effect: "A stone burning with internal fire. Using this item will increase your fire breath attack.",
      damage(weaponLvl, dragonLvl) {
        let levels = [5, 7, 10];
        let damage = 0;
        for (let i = 1; i <= dragonLvl; i++) {
          damage += this._getRandom(1, levels[weaponLvl - 1]);
        }
        return damage;
      },
      attackEffect(weaponLvl) {
        return false;
      }
    }, {
      type: "weapon",
      display: "Frost Breath",
      name: "Frost Stone",
      code: "frost",
      effect: "A frosty cold stone. Using this item will increase your frost breath attack.",
      damage(weaponLvl, dragonLvl) {
        let levels = [4, 6, 8];
        let damage = 0;
        for (let i = 1; i <= dragonLvl; i++) {
          damage += this._getRandom(1, levels[weaponLvl - 1]);
        }
        return damage;
      },
      attackEffect(weaponLvl) {
        let levels = [4, 6, 8];
        let chance = this._getRandom(1, 100);
        if (levels[weaponLvl - 1] === 4 && chance < 6) {
          return true;
        } else if (levels[weaponLvl - 1] === 6 && chance < 16) {
          return true;
        } else if (levels[weaponLvl - 1] === 8 && chance < 26) {
          return true;
        }
        return false;
      }
    }, {
      type: "weapon",
      display: "Shock Attack",
      name: "Static Stone",
      code: "static",
      effect: "A stone buzzing with static electricity. Using this item will increase your electric breath attack.",
      damage(weaponLvl, dragonLvl) {
        let levels = [4, 6, 8];
        let damage = 0;
        for (let i = 1; i <= dragonLvl; i++) {
          damage += this._getRandom(1, levels[weaponLvl - 1]);
        }
        return damage;
      },
      attackEffect(weaponLvl) {
        let levels = [4, 6, 8];
        let chance = this._getRandom(1, 100);
        if (levels[weaponLvl - 1] === 4 && chance < 6) {
          return true;
        } else if (levels[weaponLvl - 1] === 6 && chance < 16) {
          return true;
        } else if (levels[weaponLvl - 1] === 8 && chance < 26) {
          return true;
        }
        return false;
      }
    }, {
      type: "weapon",
      display: "Acid Breath",
      name: "Acid Drop",
      code: "acid",
      effect: "A vial of acid. Using this item will increase your acid breath attack.",
      damage(weaponLvl, dragonLvl) {
        let levels = [4, 6, 8];
        let damage = 0;
        for (let i = 1; i <= dragonLvl; i++) {
          damage += this._getRandom(1, levels[weaponLvl - 1]);
        }
        return damage;
      },
      attackEffect(weaponLvl) {
        let levels = [4, 6, 8];
        let chance = this._getRandom(1, 100);
        if (levels[weaponLvl - 1] === 4 && chance < 6) {
          return true;
        } else if (levels[weaponLvl - 1] === 6 && chance < 16) {
          return true;
        } else if (levels[weaponLvl - 1] === 8 && chance < 26) {
          return true;
        }
        return false;
      }
    }],
    enemies: [{
      name: "Hapless Hiker",
      weakness: "Fire Breath",
      resistance: "Frost Breath",
      code: "hiker",
      damage(level) {
        let damage = 1;
        for (let i = 1; i <= level; i++) {
          damage += this._getRandom(1, 2);
        }
        return damage;
      },
      init: function() {
        this.hp = this.level * 2 + 4;
        return this;
      }
    }, {
      name: "Terrible Tourist",
      weakness: "Fire Breath",
      resistance: "Acid Breath",
      code: "tourist",
      damage(level) {
        let damage = 0;
        for (let i = 1; i <= level; i++) {
          damage += this._getRandom(1, 3);
        }
        return damage;
      },
      init: function() {
        this.hp = this.level * 5 + 5;
        return this;
      }
    }, {
      name: "Whiny Werewolf",
      weakness: "Fire Breath",
      resistance: "Acid Breath",
      code: "werewolf",
      damage(level) {
        let damage = 0;
        for (let i = 1; i <= level; i++) {
          damage += this._getRandom(1, 3);
        }
        return damage;
      },
      init: function() {
        this.hp = this.level * 2;
        return this;
      }
    }, {
      name: "Dashing Daredevil",
      weakness: "Acid Breath",
      resistance: "Shock Attack",
      code: "daredevil",
      damage(level) {
        let damage = 0;
        for (let i = 1; i <= level; i++) {
          damage += this._getRandom(1, 4);
        }
        return damage;
      },
      init: function() {
        this.hp = this.level * 2;
        return this;
      }
    }, {
      name: "Ludicrous Larper",
      weakness: "Melee",
      resistance: "Shock Attack",
      code: "larper",
      damage(level) {
        let damage = 0;
        for (let i = 1; i <= level; i++) {
          damage += this._getRandom(1, 4);
        }
        return damage;
      },
      init: function() {
        this.hp = this.level * 3;
        return this;
      }
    }, {
      name: "Mischevious Marauder",
      weakness: "Shock Attack",
      resistance: "Fire Breath",
      code: "marauder",
      damage(level) {
        let damage = 0;
        for (let i = 1; i <= level; i++) {
          damage += this._getRandom(1, 4);
        }
        return damage;
      },
      init: function() {
        this.hp = this.level * 4;
        return this;
      }
    }, {
      name: "Intrusive Illuminati",
      weakness: "Frost Breath",
      resistance: "Fire Breath",
      code: "illuminati",
      damage(level) {
        let damage = 0;
        for (let i = 1; i <= level; i++) {
          damage += this._getRandom(1, 4);
        }
        return damage;
      },
      init: function() {
        this.hp = this.level * 3;
        return this;
      }
    }, {
      name: "Rusty Robot",
      weakness: "Shock Attack",
      resistance: "Melee",
      code: "robot",
      damage(level) {
        let damage = 0;
        for (let i = 1; i <= level; i++) {
          damage += this._getRandom(1, 4);
        }
        return damage;
      },
      init: function() {
        this.hp = this.level * 5;
        return this;
      }
    }, {
      name: "Sulking Sorcerer",
      weakness: "Melee",
      resistance: "Fire Breath",
      code: "sorcerer",
      damage(level) {
        let damage = 0;
        for (let i = 1; i <= level; i++) {
          damage += this._getRandom(1, 6);
        }
        return damage;
      },
      init: function() {
        this.hp = this.level * 2;
        return this;
      }
    }, {
      name: "Suspicious Scientist",
      weakness: "Frost Breath",
      resistance: "Acid Breath",
      code: "scientist",
      damage(level) {
        let damage = level;
        for (let i = 1; i <= level; i++) {
          damage += this._getRandom(1, 4);
        }
        return damage;
      },
      init: function() {
        this.hp = this.level * 3 + 3;
        return this;
      }
    }, {
      name: "Annoying Archaeologist",
      weakness: "Fire Breath",
      resistance: "Acid Breath",
      code: "archaeologist",
      damage(level) {
        let damage = 2;
        for (let i = 1; i <= level; i++) {
          damage += this._getRandom(1, 3);
        }
        return damage;
      },
      init: function() {
        this.hp = this.level * 2 + 4;
        return this;
      }
    }, {
      name: "Angry Alien",
      weakness: "Acid Breath",
      resistance: "Frost Breath",
      code: "alien",
      damage(level) {
        let damage = level;
        for (let i = 1; i <= level; i++) {
          damage += this._getRandom(1, 4);
        }
        return damage;
      },
      init: function() {
        this.hp = this.level * 4 + 5;
        return this;
      }
    }, {
      name: "Eccentric Explorer",
      weakness: "Frost Breath",
      resistance: "Shock Attack",
      code: "explorer",
      damage(level) {
        let damage = 0;
        for (let i = 1; i <= level; i++) {
          damage += this._getRandom(1, 4);
        }
        return damage;
      },
      init: function() {
        this.hp = this.level * 4 + 6;
        return this;
      }
    }, {
      name: "Prehistoric Pitfighter",
      weakness: "Frost Attack",
      resistance: "Melee",
      code: "pitfighter",
      damage(level) {
        let damage = 0;
        for (let i = 1; i <= level; i++) {
          damage += this._getRandom(1, 4);
        }
        return damage;
      },
      init: function() {
        this.hp = this.level * 6 + 6;
        return this;
      }
    }, {
      name: "Random Rogue",
      weakness: "Fire Breath",
      resistance: "Frost Breath",
      code: "rogue",
      damage(level) {
        let damage = 0;
        for (let i = 1; i <= level; i++) {
          damage += this._getRandom(1, 6);
        }
        return damage;
      },
      init: function() {
        this.hp = this.level * 2 + 2;
        return this;
      }
    }, {
      name: "Despicable Dungeon Diver",
      weakness: "Shock Attack",
      resistance: "Acid Breath",
      code: "diver",
      damage(level) {
        let damage = 0;
        for (let i = 1; i <= level; i++) {
          damage += this._getRandom(1, 5);
        }
        return damage;
      },
      init: function() {
        this.hp = this.level * 4 + 8;
        return this;
      }
    }, {
      name: "Bumbling Barbarian",
      weakness: "Frost Breath",
      resistance: "Acid Breath",
      code: "barbarian",
      damage(level) {
        let damage = 0;
        for (let i = 1; i <= level; i++) {
          damage += this._getRandom(1, 5);
        }
        return damage;
      },
      init: function() {
        this.hp = this.level * 5 + 10;
        return this;
      }
    }],
  };

  function _getMap() {
    const BOARDHEIGHT = 35,
      BOARDWIDTH = 100;
    let playerLoc;
    let centersArr = [];
    let mapArr = _createMapArr(BOARDHEIGHT, BOARDWIDTH);
    mapArr, centersArr = _createRooms(BOARDHEIGHT, BOARDWIDTH, mapArr);
    mapArr = _createPassages(centersArr, mapArr);
    mapArr, playerLoc = _getLocations(mapArr, BOARDHEIGHT, BOARDWIDTH);
    return [mapArr, playerLoc];
  }

  function _createMapArr(h, w) {
    let mapArr = [];
    for (let i = 0; i < h; i++) {
      mapArr.push([]);
      for (let j = 0; j < w; j++) {
        mapArr[i].push("E");
      }
    }
    return mapArr;
  }

  function _getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function _createRooms(BOARDHEIGHT, BOARDWIDTH, mapArr) {
    const MIN_ROOM_SIZE = 3,
      MAX_ROOM_SIZE = 10,
      NUM_ROOMS = 20;
    let centersArr = [];
    while (centersArr.length <= NUM_ROOMS) {
      let w = _getRandom(MIN_ROOM_SIZE, MAX_ROOM_SIZE);
      let h = _getRandom(MIN_ROOM_SIZE, MAX_ROOM_SIZE);
      let x = _getRandom(3, BOARDWIDTH - 3 - w);
      let y = _getRandom(3, BOARDHEIGHT - 3 - h);

      if (!_checkConflict(w, h, x, y, mapArr)) { //if there is no conflict add room
        for (let j = y; j < y + h; j++) {
          for (let k = x; k < x + w; k++) {
            mapArr[j][k] = "R";
          }
        }
        centersArr.push([Math.floor(x + w / 2), Math.floor(y + h / 2)]);
      }
    }
    return (mapArr, centersArr);
  }

  function _checkConflict(w, h, x, y, mapArr) {
    for (let i = y; i < y + h; i++) {
      let section = mapArr[i].slice(x, x + w);
      if (section.indexOf(0) !== -1) {
        return true; //Conflict exists - create a different room.
      }
    }
    return false; //No conflict - room can be added.
  }

  function _createPassages(centersArr, mapArr) {
    for (let j = 0; j < centersArr.length - 1; j++) {
      let x1 = Math.min(centersArr[j][0], centersArr[j + 1][0]);
      let x2 = Math.max(centersArr[j][0], centersArr[j + 1][0]);
      let y1 = Math.min(centersArr[j][1], centersArr[j + 1][1]);
      let y2 = Math.max(centersArr[j][1], centersArr[j + 1][1]);
      for (let i = x1; i <= x2; i++) {
        mapArr[centersArr[j][1]][i] = "R";
      }
      for (let i = y1; i <= y2; i++) {
        mapArr[i][centersArr[j + 1][0]] = "R";
      }
    }
    return mapArr;
  }

  function Enemy(name, weakness, resistance, code, damage, init) {
    this.name = name;
    this.type = "enemy";
    this.weakness = weakness;
    this.resistance = resistance;
    this.code = code;
    this.effect = false;
    this.level = _getRandom(gameLevel - 1 || 1, gameLevel + 1);
    this.damage = damage;
    this.reward = _getReward();
    this.init = init;
  }

  function _getLocations(mapArr, HEIGHT, WIDTH) {
    let enemiesMin = 0,
      enemiesMax = 3;
    if (gameLevel === 2) {
      enemiesMin = 4, enemiesMax = 7;
    } else if (gameLevel === 3) {
      enemiesMin = 8, enemiesMax = 12;
    } else if (gameLevel === 4) {
      enemiesMin = 13, enemiesMax = 16;
    }
    const WEAPONS = 4,
      TREASURE = 12,
      HEALTH = 6,
      ENEMIES = 15;
    let locations = [];
    let playerLoc = [];
    while (locations.length <= WEAPONS + TREASURE + HEALTH + ENEMIES) {
      const x = _getRandom(1, WIDTH - 1);
      const y = _getRandom(1, HEIGHT - 1);
      if (mapArr[y][x] === "R") {
        let info;
        if (locations.length < WEAPONS) {
          info = _getWeapon();
        } else if (locations.length < WEAPONS + TREASURE) {
          info = _getTreasure();
        } else if (locations.length < WEAPONS + TREASURE + HEALTH) {
          info = _getHealth();
        } else if (locations.length < WEAPONS + TREASURE + HEALTH + ENEMIES) {
          let s = encyclopedia.enemies[_getRandom(enemiesMin, enemiesMax)];
          info = new Enemy(s.name, s.weakness, s.resistance, s.code, s.damage, s.init);
          info.init();
        } else {
          info = {
            type: "player"
          };
          playerLoc = [x, y];
        }
        mapArr[y][x] = info;
        locations.push(info); //this controls the loop.
      }
    }
    return mapArr, playerLoc;
  }

  function _getReward() {
    let num = _getRandom(1, 100)
    if (num <= 15) {
      return _getWeapon();
    } else if (num <= 35) {
      return _getTreasure();
    } else {
      return _getHealth();
    }
  }

  function _getTreasure() {
    let num = _getRandom(0, encyclopedia.treasures.length - 1)
    return {
      type: "treasure",
      name: encyclopedia.treasures[num][0],
      code: encyclopedia.treasures[num][1],
      amount(gameLvl) {
        return gameLvl * 10
      }
    }
  }

  function _getHealth() {
    return {
      type: "health",
      code: "food",
      name: "Yummy Food",
      amount(max) {
        return Math.floor(max * .1)
      }
    }
  }

  function _getWeapon() {
    return encyclopedia.weapons[_getRandom(0, encyclopedia.weapons.length - 1)];
  }

  return _getMap();
};

class Header extends React.Component {
  render() {
    let message;
    if (this.props.boss) {
      message = "Boss unlocked!";
    } else {
      message = this.props.treasure + "/" + this.props.unlock + " treasure & " + (15 - this.props.enemiesRem) + "/10 enemies to unlock boss";
    }
    return (
      <div>
      <h1>React Roguelike Dungeon Crawler</h1>
      <div className="row">
        <div className="displays col-xs-6 col-md-2 col-md-offset-1"><p>Health: {this.props.currentHealth} / {this.props.maxHealth}</p><p className="non-essential">Items left: {this.props.healthRem}</p></div>
        <div className="displays col-xs-6 col-md-2"><p>Attack: {this.props.attack} level {this.props.attackLvl}</p>
          <p className="non-essential">Items left: {this.props.weaponsRem}</p></div>
        <div className="displays col-xs-6 col-md-2"><p>Treasure: {this.props.treasure}</p>
          <p className="non-essential">Items left: {this.props.treasureRem}</p></div>
          <div className="displays col-xs-6 col-md-2"><p className="non-essential">Level: {this.props.level}</p>
            <p>Exp: {this.props.xp} / {this.props.nextLevel}</p></div>
            <div className="displays col-xs-12 col-md-2"><p className="non-essential">Enemies Remaining: {this.props.enemiesRem}</p>
              <p>{message}</p></div>
        </div>
        </div>
    );
  }
}

class Journal extends React.Component {
  render() {
    const entries = this.props.entries;
    var rows = entries.map(function(entry, i) {
      return (<p key={i}>{entry}</p>)
    });
    return (
      <div className="journal">
      {rows}
        </div>
    );
  }
}

class Board extends React.Component {
  render() {
    let classes = "tile " + this.props.info;
    if (this.props.code) {
      classes += " " + this.props.code;
    }
    if (this.props.direction) {
      classes += " " + this.props.direction;
    }
    return (
      <div className={classes} key={this.props.index}></div>
    );
  }
}

ReactDOM.render(
  <Maps />, document.getElementById("container")
);
