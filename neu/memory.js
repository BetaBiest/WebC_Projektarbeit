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
    if (!parent.inputBlock) {
      this.parent.handleClick(this);
    }
  }
}

class Memory {
  constructor(html_game) {
    this.playerList = new Array(); // Array of Arrays [0="Name", 1="Points", 2="li-entry"]
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

    this.html_game = html_game;
    this.createHTMLGameConstruct(this.html_game); // Overload to show usage of this.html_game
    this.createPlayerList(this.html_game_content_menu);
    this.addPlayer();
    this.createHTMLStartBlock (this.html_game_content_gameArea);
    this.createHTMLEndBlock   (this.html_game_content_gameArea);
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

    this.html_game_content_menu = document.createElement('div');
    this.html_game_content_menu.classList.add('menu');
    this.html_game_content.appendChild(this.html_game_content_menu);

    this.html_game_content_gameArea = document.createElement('div');
    this.html_game_content_gameArea.classList.add('game-area');
    this.html_game_content.appendChild(this.html_game_content_gameArea);
  }

  createPlayerList() {
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
    this.html_game_content_menu.appendChild(this.html_menu_playerList);

    // Playerlist while game is active
    this.html_menu_activePlayerList = document.createElement('ul');
    this.html_menu_activePlayerList.classList.add('player-list-active');
    this.html_menu_activePlayerList.classList.add('removed');
    this.html_game_content_menu.appendChild(this.html_menu_activePlayerList);
  }

  addPlayer() {
    let numOfPlayer = this.html_menu_playerList.childElementCount - 1;
    if (numOfPlayer < 4) {
      this.playerList[numOfPlayer] = new Array(3);
      
      this.playerList[numOfPlayer][1] = 0;

      // li-items for players while game is inactive
      let html_new_liItem = document.createElement('li');
      html_new_liItem.innerHTML =   '<input type="text" name="" id="" placeholder="Player '
                                  + (this.playerList.length - 1) + '"'
                                  + ' maxlength="15" />';
      html_new_liItem.addEventListener('change', () => this.updatePlayerNames());
      this.html_menu_playerList.insertBefore(html_new_liItem, this.html_menu_playerList.lastElementChild);

      // li-items for players while game is active
      this.playerList[numOfPlayer][2] = document.createElement('li');
      this.playerList[numOfPlayer][2]
      this.playerList[numOfPlayer][2].innerHTML =
          '<span class="score">'
        +   'Player ' + (this.playerList.length - 1) + ' : ' + this.playerList[numOfPlayer][1] + ' Points'
        + '</span>'
        + '<span class="collected-items"></span>';
      this.html_menu_activePlayerList.appendChild(this.playerList[numOfPlayer][2]);
    }
    this.updatePlayerNames();
  }

  remPlayer() {
    if (this.html_menu_playerList.childElementCount > 2) { // Do not delete if there is only 1 player
      this.playerList.length = this.playerList.length - 1;
      this.html_menu_playerList.removeChild(this.html_menu_playerList.lastElementChild.previousElementSibling);
      this.html_menu_activePlayerList.removeChild(this.html_menu_activePlayerList.lastElementChild);
      delete this.playerList[this.playerList.length];
    }
    else {
      this.playerList[0][0] = 'Player 0';
      this.html_menu_playerList.firstElementChild.firstElementChild.value = '';
    }
  }

  updatePlayerNames() {
    let i = 0;
    let names = this.html_menu_playerList.querySelectorAll('input');
    for (let name of names) {
      if (name.value != "") this.playerList[i][0] = name.value;
      else this.playerList[i][0] = 'Player ' + i;
      i++;
    }

    i = 0;
    let activeNames = this.html_menu_activePlayerList.querySelectorAll('.score');
    for (let name of activeNames) {
      name.innerText = 
        name.innerText.replace(/([A-z]|[0-9]| )* :/i, this.playerList[i++][0] + ' : ');
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

    this.html_game_content_gameArea.appendChild(this.html_gameArea_startBlock);
  }

  createHTMLEndBlock() {
    this.html_gameArea_endBlock = document.createElement('div');
    this.html_gameArea_endBlock.classList.add('end-block');
    this.html_gameArea_endBlock.classList.add('removed');

    this.html_gameArea_endBlock.innerHTML = '\
      <span>🥳 Winner 🥳</span>\
      <span id="winner">Player 3</span>\
      ';

      let html_endBlock_button = document.createElement('button');
      html_endBlock_button.addEventListener('click', () => console.log(this.resetGame()));
      html_endBlock_button.setAttribute('type', 'button');
      html_endBlock_button.innerText = 'New Game';

      this.html_gameArea_endBlock.appendChild(html_endBlock_button);


    this.html_game_content_gameArea.appendChild(this.html_gameArea_endBlock);
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
    this.html_menu_playerList.classList.add('removed');
    this.html_menu_activePlayerList.classList.remove('removed');

    this.html_gameArea_startBlock.classList.add('removed');1

    this.html_game_content_gameArea.classList.add('active');
    this.activePlayer = this.randomInt(0, this.numOfPlayers);
    this.playerList[this.activePlayer][2].classList.add('active');

    this.createCards();
    this.appendCards();
  }

  endGame() {
    this.removeCards();
    this.html_game_content_gameArea.classList.remove('active');
    this.html_gameArea_endBlock.querySelector('#winner').innerText = this.determineWinner('name');
    this.html_gameArea_endBlock.classList.remove('removed');
    this.html_menu_activePlayerList.querySelector('.active').classList.remove('active');
    this.playerList[this.determineWinner('index')][2].classList.add('active');
  }
  
  resetGame() { // TODO implement
    if (!this.gameOver) {
      this.removeCards();
    }
    this.html_gameArea_endBlock.classList.add     ('removed');
    this.html_menu_activePlayerList.classList.add ('removed');
    this.html_menu_playerList.classList.remove    ('removed');
    this.html_gameArea_startBlock.classList.remove('removed');
    
    // Reset Points Clear activePlayerList
    for (let player of this.playerList) {
      player[1] = 0;
      let nameAndPoints = player[2].querySelector('.score');
      nameAndPoints.innerText = 
        nameAndPoints.innerText.replace(/: [0-9]+ [A-z]*/i, ': 0 Points');
      let collectedItems = player[2].querySelector('.collected-items');
      collectedItems.innerText = '';
    }
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
  
    // Fill Array randomly with 2 of each symbol
    for (let i = 0; i < totalSymbols * 2; i++) {
      let buffer = symbols[i % totalSymbols];
    
      if (i == (totalSymbols * 2 - 1) && this.totalCards % 2) break; // Leave last symbol alone when num of cards is uneven
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
      this.html_game_content_gameArea.appendChild(this.cards[i].html_card);
    }
  }
  
  removeCards() {
    this.html_game_content_gameArea.innerHTML = '';
    this.html_game_content_gameArea.classList.remove('active');
    this.html_game_content_gameArea.appendChild(this.html_gameArea_startBlock);
    this.html_game_content_gameArea.appendChild(this.html_gameArea_endBlock);
  }

  handleClick(card) {
    if (this.firstTry) {
      card.flip();
      this.firstCard = card;
      this.firstTry = false;
    }
    else {
      if (!(this.firstCard == card)) {
        this.inputBlock = true;
        card.flip();
        // TODO check actual sign not the inner Text
        if (this.firstCard.value == card.value) { // Player found 2 matching cards
          this.playerList[this.activePlayer][1] += 1;
          let i = 0;
          let activePlayer = this.html_menu_activePlayerList.querySelector('.active');
          let nameAndPoints = activePlayer.querySelector('.score');
          nameAndPoints.innerText = 
            nameAndPoints.innerText.replace(/: [0-9]+ [A-z]*/i, ': ' + this.playerList[this.activePlayer][1] + (this.playerList[this.activePlayer][1] == 1 ? ' Point' : ' Points'));
          let collectedItems = activePlayer.querySelector('.collected-items');
          collectedItems.innerText += String.fromCodePoint(card.value);

          this.sleep(800)
              .then(() => { this.firstCard.hide() })
              .then(() => { card.hide() })
              .then(() => this.inputBlock = false)
              .then(() => {
                if (this.checkGameOver()) {
                  this.gameOver = true;
                  this.endGame();
                }
              })
          ;

        } else { // Player didn´t found a pair
            this.playerList[this.activePlayer][2].classList.remove('active');
            this.activePlayer++;
            if (this.activePlayer == this.numOfPlayers) this.activePlayer = 0;
            this.playerList[this.activePlayer][2].classList.add('active');

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

  /** @returns {boolean} Gameover T/F */
  checkGameOver() {
    if (game.html_game_content_gameArea.querySelectorAll('.hidden').length == this.totalCards) {
      return true;
    } else return false;
  }

  /**
   * @param {String} [returnType] ('name' | 'index')
   * @returns {String | Number} Playername | Index for Playerlist */
  determineWinner(returnType) {
    let index = 0, max = 0;
    for (let i in this.playerList) {
      if (this.playerList[i][1] > max) {
        index = Number(i);
        max = this.playerList[i][1];
      }
    }
    if (returnType === 'name') {
      return this.playerList[index][0];      
    }
    else if (returnType === 'index') {
      return index;
    }
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