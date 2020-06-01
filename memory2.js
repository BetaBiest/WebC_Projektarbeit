var Game = Game || {}; // namespace

/**
 * Game.Memory
 * @constructor
 * @param {number} [cols] Number of Columns
 * @param {number} [rows] Number of Rows
 * @param {number} [players = 2] Number of Players
 * @returns {Game.Memory}
 */
Game.Memory = function (cols, rows, players = 2) {
  this.players;
  this.player_turn = 0;
  this.points = new Array(players);
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
  var Gameboard = function (cols, rows) {
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

      let cellClass = document.createAttribute('class');
      cellClass.value = 'col-' + (c + 1) + ' ' + 'card';
      this.card.setAttributeNode(cellClass);
      cellClass = document.createAttribute('onClick');
      cellClass.value = 'console.log(this)'; // TODO call Game.Memory.clickHandler()
      this.card.setAttributeNode(cellClass);

      this.content = document.createTextNode('');
      this.card.appendChild(this.content);
    };

    Card.prototype = {
      constructor: Card,
    };

    this.rows = new Array(rows);
    for (let i = 0; i < rows; i++) {
      this.rows[i] = this.createRow(Number(i));
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
      let newRow = document.createElement("div");
      let rowClass = document.createAttribute("class");
      rowClass.value = "row-" + (n + 1);
      newRow.setAttributeNode(rowClass);

      this.gameboard.appendChild(newRow); // TODO rethink gameboard...
      return newRow;
    },

  };

  this._gameboard = new Gameboard(cols, rows);
};

Game.Memory.prototype = {
  constructor: Game.Memory,
  /**
   * handleClick
   * @param {HTMLElement} card clicked Card
   */
  handleClick: function (card) {
    // TODO transfer from index.js
  },
  checkGameOver: function () {
    // TODO transfer from index.js
    return false;
  },
  flipCard: function () {
    // TODO transfer from index.js
  },
  hide: function (card) {
    // TODO transfer from index.js
  },
  blockInput: function () {
    // TODO Block Input while delay is active
  },
  unblockInput: function () {
    // TODO Unblock Input when delay is over
  },
  sleep: function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
};
