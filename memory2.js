var Game = Game || {}; // namespace

/**
 * Game.Memory
 * @constructor
 * @param {number} [cols] Number of Columns
 * @param {number} [rows] Number of Rows
 * @param {number | string[]} [players] Number of Players or Array with Names
 * @returns {Game.Memory}
 */
Game.Memory = function (cols, rows, players = 2) {
  this.players = new Array();
  if (typeof(players) == 'number') {
    for (let i = 0; i < players; i++) {
      this.players[i] = ['Player' + i, 0];
    }
  } else if (typeof(players[0]) == 'string') {
    for (let i = 0; i < players.length; i++) {   
      this.players[i] = [players[i], 0];
    }
  }
  this.player_turn = 0;
  this.cols = cols;
  this.rows = rows;
  this.totalCards = cols * rows;
  this.firstTry = true;
  this.firstCard;
  this.gameOver = false;
  this.gameInformation;
  this.gameboard = document.querySelector('#gameboard');

  /**
   * Gameboard
   * @constructor
   * @param {number} [cols] Number of Columns
   * @param {number} [rows] Number of Rows
   * @returns {Gameboard}
   */
  var Gameboard = function (cols, rows, gameboard) {
    /**
     * Card
     * @constructor
     * @param {number} c XPosition from the Card
     * @param {number} r YPosition from the Card
     * @returns {Card} HTML Object
     */
    var Card = function (c, r) {
      this.c = c, this.r = r;

      this.card = document.createElement('div');

      this.card.setAttribute('class', 'col-' + (c + 1) + ' ' + 'card');
      this.card.addEventListener('click', () => this.handleClick(this));
    };

    Card.prototype = {
      constructor: Card,
      handleClick: (card) => this.handleClick(card),
    };

    this.rows = new Array(rows);
    for (let i = 0; i < rows; i++) {
      this.rows[i] = this.createRow(Number(i));
      gameboard.appendChild(this.rows[i]);
    }

    this.board = new Array(cols);
    for (let i = 0; i < cols; i++) this.board[i] = new Array(rows);
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        this.board[c][r] = new Card(c, r);
        this.rows[r].appendChild(this.board[c][r].card);
      }
    }
  };
  Gameboard.prototype = {
    constructor: Gameboard,

    createRow: function (n) {
      let newRow = document.createElement('div');
      newRow.setAttribute('class', 'row-' + (n + 1));
      return newRow;
    },

    handleClick: (card) => this.handleClick(card),
  };

  this._gameboard = new Gameboard(this.cols, this.rows, this.gameboard);

  // Create storage for game information
  this.gameInformation = new Array(cols);
  for (let i = 0; i < cols; i++) {
    this.gameInformation[i] = new Array(rows);
  }

  // Determine needed Symbols and create then
  let totalSymbols;
  if (this.totalCards % 2) totalSymbols = this.totalCards / 2 + .5;
  else totalSymbols = this.totalCards / 2;
  let symbols = new Array(this.totalSymbols);
  for (let i = 0; i < totalSymbols; i++) {
    symbols[i] = 0x1F600 + i;
  }

  // Fill Array randomly with 2 of every symbol
  for (let i = 0; i < totalSymbols * 2; i++) {
  let buffer = symbols[i % totalSymbols];

  if (i == (totalSymbols * 2 - 1) && this.totalCards % 2) break; // Leave last symbol alone when num of cards is uneven
  let random = Math.floor(this.map(Math.random(), 0, 1, 0, this.totalCards));
  while (this.gameInformation[(random % this.cols)][(Math.floor(random / this.cols))] != undefined) {
    random++;
    if (random == this.totalCards) random = 0;
  }
  this.gameInformation[(random % this.cols)][(Math.floor(random / this.cols))] = buffer;
  }
};

Game.Memory.prototype = {
  constructor: Game.Memory,

  handleClick: function (card) {
    if (this.firstTry) {
      this.flipCard(card);
      this.firstCard = card;
      this.firstTry = false;
    }
    else {
      if (!(this.firstCard == card)) {
        this.flipCard(card);
        // FIXME check actual sign not the inner Text
        if (this.firstCard.card.innerText == card.card.innerText) { // Player found 2 matching cards
            this.players[this.player_turn][1] += 1;
            console.log('Score for ' + this.players[this.player_turn][0]);

            // TODO Block input
            this.sleep(800)
                .then(() => { this.hide(this.firstCard) })
                .then(() => { this.hide(card) })
                // TODO Unblock input
                ;
            if (this.checkGameOver()) this.gameOver = true;

        } else { // Player didn´t found a pair
          this.player_turn++;
          if (this.player_turn == this.players.length) this.player_turn = 0;

          // TODO Block input
          this.sleep(1000)
              .then(() => { this.flipCard(this.firstCard) })
              .then(() => { this.flipCard(card) })
              // TODO Unblock input
              ;
        }
        this.firstTry = true;
      }
    }
  },

  checkGameOver: function () {
    // Count the collected points
    let collectedPoints = 0;
    for (let i in this.players) {
        collectedPoints += this.players[i][1];
    }

    // Turn points into cards and add one in case there is one trick card
    collectedPoints *= 2;
    if (this.totalCards % 2) collectedPoints++;

    // Check if all cards are already collected
    if (collectedPoints == this.totalCards) return true;
    else return false;
  },

  flipCard: function (card) {
    if (card.card.innerText == '') {
      card.card.innerText = String.fromCodePoint(this.gameInformation[card.c][card.r]); // TODO create arr
    }
    else card.card.innerText = '';
  },

  hide: function (card) {
    card.card.className += ' ' + 'hidden';
  },

  blockInput: function () {
    // TODO Block Input while delay is active
  },

  unblockInput: function () {
    // TODO Unblock Input when delay is over
  },

  getScore: function () { // Temporary for debugging purposes
    for (let i in this.players) {
      console.log(this.players[i][0] + ' points: ' + this.players[i][1]);
    }
  },

  sleep: function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  map: function (n, start1, stop1, start2, stop2) {
    const newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
    return newval;
  },

};