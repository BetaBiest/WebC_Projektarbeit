class Card {
  constructor(value, parent) {
    this.parent = parent;
    this.value = value;
    this.html_card = document.createElement('div');
    this.html_card.classList.add('card-outterShell');
    this.html_card.addEventListener('click', () => { this.handleClick() });

    this.html_cardInner = document.createElement('div');
    this.html_cardInner.classList.add('card-innerShell');
/*     this.html_cardInner.addEventListener('transitionend', () => { this.handleClick() }); */
    this.html_card.appendChild(this.html_cardInner);

    let html_cardInner_front = document.createElement('div');
    html_cardInner_front.classList.add('front');
    this.html_cardInner.appendChild(html_cardInner_front);

    let html_cardInner_back = document.createElement('div');
    html_cardInner_back.classList.add('back');
    html_cardInner_back.innerText = String.fromCodePoint(this.value);
    this.html_cardInner.appendChild(html_cardInner_back);
  }

  flip() {
    if (this.html_cardInner.classList.contains('turn')) {
      this.html_cardInner.classList.remove('turn'); // TODO Check correctness
    }
    else this.html_cardInner.classList.add('turn');
  }

  hide() {
    if (this.html_card.classList.contains('hidden')) {
      this.html_card.classList.remove('hidden');
    }
    else this.html_card.classList.add('hidden');
  }

  handleClick() {
    if (!this.parent.inputBlock) {
      this.parent.handleClick(this);
    }
  }
}

class Memory {
  constructor(html_game) {
    this.playerList = new Array(); // Array of Objects {"name":String, "points":Number, "lientry":DOMObject}
    this.numOfPlayers = 0;
    this.activePlayer = 0; // whole number between 0 and numOfPlayers
    this.firstTry = true;

    this.gameactive = false;
    this.gameOver = true;
    this.inputBlock = false;

    this.firstCard;
    this.totalCards = 20;
    this.activeCard;

    this.gameboard;
    this.cards = new Array();

    this.passedTime = 0;
    this.timerInterval;

    this.html_game = html_game;
    this.createHTMLGameConstruct(this.html_game); // appends this.html_game
    this.createHTMLMenu(this.html_content_menu);  // appends this.html_content_menu
    this.addPlayer(); // First Player, not removeable
    this.createHTMLStartBlock (this.html_content_gameArea); // appends this.html_content_gameArea
    this.createHTMLEndBlock   (this.html_content_gameArea); // appends this.html_content_gameArea
  }

  createHTMLGameConstruct() {
    // Could also create its own wrapper
/*     this.html_game = document.createElement('div');
    this.html_game.classList.add('game'); */

    this.html_game_headline = document.createElement('span');
    this.html_game_headline.innerHTML = '<h1>Memory</h1>';
    this.html_game.appendChild(this.html_game_headline);

    this.html_game_content = document.createElement('div');
    this.html_game_content.classList.add('content');
    this.html_game.appendChild(this.html_game_content);

    this.html_content_menu = document.createElement('div');
    this.html_content_menu.classList.add('menu');
    this.html_game_content.appendChild(this.html_content_menu);

    this.html_content_gameArea = document.createElement('div');
    this.html_content_gameArea.classList.add('game-area');
    this.html_game_content.appendChild(this.html_content_gameArea);
  }

  createHTMLMenu() {
    this.html_menu_playerList = document.createElement('ul');
    this.html_menu_playerList.style.listStyle = 'none';
    this.html_menu_playerList.classList.add('player-list');

    let html_li_buttons = document.createElement('li');

      let html_li_buttons_add = document.createElement('button');
      html_li_buttons_add.addEventListener('click', () => this.addPlayer());
      html_li_buttons_add.classList.add('li-buttons-plus');
      html_li_buttons_add.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>';
      html_li_buttons.appendChild(html_li_buttons_add);

      let html_li_buttons_sub = document.createElement('button');
      html_li_buttons_sub.addEventListener('click', () => this.remPlayer());
      html_li_buttons_sub.classList.add('li-buttons-sub');
      html_li_buttons_sub.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 13H5v-2h14v2z"/></svg>';
      html_li_buttons.appendChild(html_li_buttons_sub);

    this.html_menu_playerList.appendChild(html_li_buttons);
    this.html_content_menu.appendChild(this.html_menu_playerList);

    // Playerlist while game is active
    this.html_menu_activePlayerList = document.createElement('ul');
    this.html_menu_activePlayerList.classList.add('player-list-active');
    this.html_menu_activePlayerList.classList.add('removed');
    this.html_content_menu.appendChild(this.html_menu_activePlayerList);

    // Resetbutton and timer
    this.html_menu_resetField = document.createElement('div');
      this.html_resetField_timer = document.createElement('span');
      this.html_resetField_timer.innerText = 'Time 00:00';
      this.html_menu_resetField.appendChild(this.html_resetField_timer);

      let html_resetField_button = document.createElement('button');
      html_resetField_button.setAttribute('type', 'button');
      html_resetField_button.innerText = 'Reset Game';
      html_resetField_button.addEventListener('click', () => this.resetGame());
      this.html_menu_resetField.appendChild(html_resetField_button);
    this.html_menu_resetField.classList.add('removed');
    this.html_content_menu.appendChild(this.html_menu_resetField);
  }

  addPlayer() {
    let numOfPlayer = this.html_menu_playerList.childElementCount - 1;
    if (numOfPlayer < 4) {
      this.playerList[numOfPlayer] = {'name': 'Player ' + (this.playerList.length), 'points': 0, 'trys': 0, 'lientry': null};


      // li-items for players while game is inactive
      let html_new_liItem = document.createElement('li');
      html_new_liItem.innerHTML = 
        `<input type="text" placeholder="Player ${this.playerList.length - 1}" maxlength="15" />`

      html_new_liItem.addEventListener('change', () => this.updatePlayerNames());
      this.html_menu_playerList.insertBefore(html_new_liItem, this.html_menu_playerList.lastElementChild);

      // li-items for players while game is active
      this.playerList[numOfPlayer].lientry = document.createElement('li');
      this.playerList[numOfPlayer].lientry
      this.playerList[numOfPlayer].lientry.innerHTML =
          '<span class="score">'
        +   `${this.playerList[numOfPlayer].name} : ${this.playerList[numOfPlayer].points} Points : ${this.playerList[numOfPlayer].trys} Trys`
        + '</span>'
        + '<span class="collected-items"></span>';
      this.html_menu_activePlayerList.appendChild(this.playerList[numOfPlayer].lientry);
    }
  }

  remPlayer() {
    if (this.html_menu_playerList.childElementCount > 2) { // Do not delete if there is only 1 player
      this.playerList.length = this.playerList.length - 1;
      this.html_menu_playerList.removeChild(this.html_menu_playerList.lastElementChild.previousElementSibling);
      this.html_menu_activePlayerList.removeChild(this.html_menu_activePlayerList.lastElementChild);
      delete this.playerList[this.playerList.length];
    }
    else {
      this.html_menu_playerList.firstElementChild.firstElementChild.value = '';
      this.updatePlayerNames();
    }
  }

  updatePlayerNames() {
    let i = 0;
    let names = this.html_menu_playerList.querySelectorAll('input');
    for (let name of names) {
      if (name.value != "") this.playerList[i].name = name.value;
      else this.playerList[i].name = `Player ${i}`;
      i++;
    }

    i = 0;
    let activeNames = this.html_menu_activePlayerList.querySelectorAll('.score');
    for (let name of activeNames) {
      name.innerText = 
        name.innerText.replace(/[^:]* :/i, `${this.playerList[i++].name} :`);
    }
  }

  createHTMLStartBlock() {
    this.html_gameArea_startBlock = document.createElement('div');
    this.html_gameArea_startBlock.classList.add('start-block');

    let html_startBlock_sizeSetting = document.createElement('label');
    html_startBlock_sizeSetting.setAttribute('for', 'size');
    html_startBlock_sizeSetting.style.display = 'block';

      let html_sizeSetting_label = document.createElement('span')
      html_sizeSetting_label.style.display = 'block';

        let html_sizeSetting_label_left = document.createElement('span');
        html_sizeSetting_label_left.style.float = 'left';
        html_sizeSetting_label_left.innerText = 'Size';
        html_sizeSetting_label.appendChild(html_sizeSetting_label_left);

        this.html_sizeSetting_label_right = document.createElement('span');
        this.html_sizeSetting_label_right.style.float = 'right';
        this.html_sizeSetting_label_right.innerText = '10 Pairs';
        html_sizeSetting_label.appendChild(this.html_sizeSetting_label_right);

      html_startBlock_sizeSetting.appendChild(html_sizeSetting_label);

      this.html_sizeSetting_slider = document.createElement('input');
      this.html_sizeSetting_slider.setAttribute('type', 'range');
      this.html_sizeSetting_slider.setAttribute('name', 'size');
      this.html_sizeSetting_slider.setAttribute('id', 'size');
      this.html_sizeSetting_slider.setAttribute('min', '5');
      this.html_sizeSetting_slider.setAttribute('max', '25');
      this.html_sizeSetting_slider.setAttribute('step', '1');
      this.html_sizeSetting_slider.setAttribute('value', '10');
      this.html_sizeSetting_slider.addEventListener('change', () => { this.changeGameSize() });
      html_startBlock_sizeSetting.appendChild(this.html_sizeSetting_slider);

    this.html_gameArea_startBlock.appendChild(html_startBlock_sizeSetting);

    let html_startBlock_playButton = document.createElement('button');
    html_startBlock_playButton.setAttribute('type', 'button');
    html_startBlock_playButton.innerText = 'PLAY';
    html_startBlock_playButton.addEventListener('click', () => { this.startGame() });
    this.html_gameArea_startBlock.appendChild(html_startBlock_playButton);

    this.html_content_gameArea.appendChild(this.html_gameArea_startBlock);
  }

  createHTMLEndBlock() {
    this.html_gameArea_endBlock = document.createElement('div');
    this.html_gameArea_endBlock.classList.add('end-block');
    this.html_gameArea_endBlock.classList.add('removed');

    this.html_gameArea_endBlock.innerHTML = '\
      <span>🥳 Winner 🥳</span>\
      <span id="winner"></span>\
      ';

      let html_endBlock_button = document.createElement('button');
      html_endBlock_button.addEventListener('click', () => console.log(this.resetGame()));
      html_endBlock_button.setAttribute('type', 'button');
      html_endBlock_button.innerText = 'New Game';

      this.html_gameArea_endBlock.appendChild(html_endBlock_button);

    this.html_content_gameArea.appendChild(this.html_gameArea_endBlock);
  }

  changeGameSize() {
    let sliderValue = this.html_sizeSetting_slider.value;
    this.html_sizeSetting_label_right.innerText =
        this.html_sizeSetting_label_right.innerText.replace(/[0-9]+/i, sliderValue);

    this.totalCards = sliderValue * 2;
  }

  startGame() {
    this.numOfPlayers = this.playerList.length;
    this.gameactive = true;
    this.gameOver = false;
    
    this.html_menu_playerList.classList.add         ('removed');
    this.html_gameArea_startBlock.classList.add     ('removed');

    this.html_menu_activePlayerList.classList.remove('removed');
    this.html_menu_resetField.classList.remove  	  ('removed');

    this.html_content_gameArea.classList.add('active');
    const cols = Math.ceil(Math.sqrt(this.totalCards));
    this.html_content_gameArea.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    // removes active class from each player that currently possesses it (in case winners from prev game are hightlighted)
    let activePlayers = this.html_menu_activePlayerList.querySelectorAll('.active');
    for (let player of activePlayers) {
      player.classList.remove('active');
    }
    // random Player gets selected to start
    this.activePlayer = this.randomInt(0, this.numOfPlayers);
    this.playerList[this.activePlayer].lientry.classList.add('active');

    this.createCards();
    this.appendCards();

    this.timerInterval = setInterval(() => { this.timer() }, 1000);
  }

  endGame() {
    clearInterval(this.timerInterval); // stops timer
    this.removeCards();
    this.html_content_gameArea.classList.remove('active');

    let html_winners = this.html_gameArea_endBlock.querySelector('#winner');
    html_winners.innerHTML = '';

    // removes active class from each player that currently possesses it
    let activePlayers = this.html_menu_activePlayerList.querySelectorAll('.active');
    for (let player of activePlayers) {
      player.classList.remove('active');
    }

    // winners names get written in the dialog and they are highlighted
    let winners_index = this.determineWinner();
    for (let i in winners_index) {
      html_winners.innerHTML += `${this.playerList[winners_index[i]].name}</br>`;
      this.playerList[winners_index[i]].lientry.classList.add('active');
    }

    this.html_gameArea_endBlock.classList.remove('removed');
  }
  
  resetGame() {
    if (!this.gameOver) {
      clearInterval(this.timerInterval); // stops timer
      this.html_menu_activePlayerList.querySelector('.active').classList.remove('active');
      this.removeCards();
    }
    this.html_gameArea_endBlock.classList.add     ('removed');
    this.html_menu_activePlayerList.classList.add ('removed');
    this.html_menu_resetField.classList.add       ('removed');
    this.html_menu_playerList.classList.remove    ('removed');
    this.html_gameArea_startBlock.classList.remove('removed');
    
    // Reset Points Clear activePlayerList
    for (let player of this.playerList) {
      player.points = 0;
      player.trys = 0;
      let nameAndPoints = player.lientry.querySelector('.score');
      nameAndPoints.innerText = `${player.name} : ${player.points} Points : ${player.trys} Trys`;
      let collectedItems = player.lientry.querySelector('.collected-items');
      collectedItems.innerText = '';
    }

    // Reset Timer
    this.passedTime = 0;
    this.html_resetField_timer.innerText = 
      this.html_resetField_timer.innerText.replace(/[0-9]{2}:[0-9]{2}/i, '00:00');
  }

  createCards() {
    this.gameboard = new Array(this.totalCards);

    let totalSymbols;
    if (this.totalCards % 2) totalSymbols = this.totalCards / 2 + .5;
    else totalSymbols = this.totalCards / 2;

    let symbols = new Array(this.totalSymbols);
    for (let i = 0; i < totalSymbols; i++) {
      symbols[i] = 0x1F600 + i;
    }
  
    // fill Array randomly with 2 of each symbol
    for (let i = 0; i < totalSymbols * 2; i++) {
      let buffer = symbols[i % totalSymbols];
    
      if (i == (totalSymbols * 2 - 1) && this.totalCards % 2) break; // leave last symbol alone when num of cards is uneven
      let random = Math.floor(this.map(Math.random(), 0, 1, 0, this.totalCards));
      while (this.gameboard[random] != undefined) {
        random++;
        if (random == this.totalCards) random = 0;
      }
      this.gameboard[random] = buffer;
    }

    for(let i = 0; i < this.totalCards; i++) {
      this.cards[i] = new Card(this.gameboard[i], this);
    }
  }

  appendCards() {
    for(let i in this.cards) {
      this.html_content_gameArea.appendChild(this.cards[i].html_card);
    }
  }
  
  // clears the gameArea and the array that contains the cards
  removeCards() {
    this.html_content_gameArea.innerHTML = '';
    this.html_content_gameArea.classList.remove('active');
    this.html_content_gameArea.appendChild(this.html_gameArea_startBlock);
    this.html_content_gameArea.appendChild(this.html_gameArea_endBlock);

    delete this.cards;
    this.cards = new Array();
  }

  handleClick(card) {
    if (this.firstTry) {
      card.flip();
      this.firstCard = card;
      this.firstTry = false;
    }
    else {
      if (!(this.firstCard == card)) {
        this.inputBlock = true; // critical section because two cards are already selected
        card.flip();

        let activePlayerLiEntry = this.html_menu_activePlayerList.querySelector('.active');
        let nameAndPoints = activePlayerLiEntry.querySelector('.score');

        // counting up the number of trys
        nameAndPoints.innerText =
          nameAndPoints.innerText.replace(/: [0-9]+ (Trys|Try)/i,
            `: ${++this.playerList[this.activePlayer].trys} ${this.playerList[this.activePlayer].trys != 1 ? ' Trys' : ' Try'}`
            );

        if (this.firstCard.value == card.value) { // player found 2 matching cards
          this.playerList[this.activePlayer].points += 1;
          nameAndPoints.innerText = 
            nameAndPoints.innerText.replace(/: [0-9]+ Point[s]{0,1}/i, ': ' + this.playerList[this.activePlayer].points + (this.playerList[this.activePlayer].points == 1 ? ' Point' : ' Points'));
          let collectedItems = activePlayerLiEntry.querySelector('.collected-items');
          collectedItems.innerText += String.fromCodePoint(card.value);

          this.sleep(200)
              .then(() => { this.firstCard.html_card.classList.add('inactive') })
              .then(() => { card.html_card.classList.add('inactive') })
              .then(() => this.inputBlock = false)
              .then(() => {
                if (this.checkGameOver()) {
                  this.gameOver = true;
                  this.endGame();
                }
              })
          ;

        } else { // player didn´t found a pair
            this.playerList[this.activePlayer].lientry.classList.remove('active');
            this.activePlayer++;
            if (this.activePlayer == this.numOfPlayers) this.activePlayer = 0;
            this.playerList[this.activePlayer].lientry.classList.add('active');

            this.inputBlock = true;
            this.sleep(1000)
                .then(() => { this.firstCard.flip() })
                .then(() => { card.flip() })
                .then(() => this.inputBlock = false)
                ;
        }

        this.firstTry = true;
      }
    }
  }

  timer() {
    let minutes = Math.floor(this.passedTime / 60) % 60;
    if (minutes < 10) minutes = '0' + minutes;
    let secounds = this.passedTime % 60;
    if (secounds < 10) secounds = '0' + secounds;
    this.html_resetField_timer.innerText = 
      this.html_resetField_timer.innerText.replace(/[0-9]{2}:[0-9]{2}/i, `${minutes}:${secounds}`);
    this.passedTime += 1;
  }

  /** @returns {boolean} Gameover T/F */
  checkGameOver() {
    if (game.html_content_gameArea.querySelectorAll('.inactive').length == this.totalCards) {
      return true;
    } else return false;
  }

  /** @returns {Array} Array of Indices for playerList */
  determineWinner() {
    let max = 0;
    for (let i in this.playerList) {
      if (this.playerList[i].points > max) {
        max = this.playerList[i].points;
      }
    }
    let winners = new Array();
    let index = 0;
    for (let i in this.playerList) {
      if (this.playerList[i].points == max){
        winners[index++] = Number(i);
      }
    }
    return winners;
  }

  /**
   * function randomInt()
   * @param {Number} [min] floor
   * @param {Number} [max] ceiling
   * @returns {Number} Random Integer in given Range
   */
  randomInt(min, max) {
    return Math.floor(this.map(Math.random(), 0, 1, min, max));
  }

  /**
   * function map()
   * @param {Number} n Value
   * @param {Number} start1 source floor
   * @param {Number} stop1 source ceiling
   * @param {Number} start2 target floor
   * @param {Number} stop2 target ceiling
   * @returns {Number} Value between new boundaries
   */
  map(n, start1, stop1, start2, stop2) {
    const newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
    return newval;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}