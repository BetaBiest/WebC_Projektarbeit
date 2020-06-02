// FIXME nothing works here ^^

class Game_Memory {
  static count = 0;
  static gameboard;
  static gameinformation;
  static players;
  static player_turn = 0;
  static points;
  static fistCard;
  static secondTry = false;
  static gameOver = false;

  constructor(c = 0, r = 0, players = 2) {
    this.gameboard = document.querySelector("#gameboard");
    this.players = players;
    this.points = new Array(this.players);
    this.cols = c;
    this.rows = r;
    this.totalCards = r * c;
    this.gameinformation = this.createGame(c, r);
  }

  static flipCard(card) {
    if (card.innerText == '') {
      let pos;
      let row = card.parentElement.className;
      pos = row.search('row-');
      row = Number(row.slice(pos + 4, pos + 5));
      let col = card.className;
      pos = col.search('col-');
      col = Number(col.slice(pos + 4, pos + 5));

      card.innerText = String.fromCodePoint(this.gameinformation[col - 1][row - 1]);
    }
    else card.innerText = '';
  }

  static hide(card) {
    card.className += ' ' + 'hidden';
  }

  static checkGameOver() {
    let collectedPoints = 0;
    // Count the collected points
    for (let i in this.points) {
      collectedPoints += this.points[i];
    }

    // Turn points into cards and add one in case there is one trick card
    collectedPoints *= 2;
    if (this.totalCards % 2) collectedPoints++;

    // Check if all cards are already collected
    if (collectedPoints == this.totalCards) return true;
    else return false;
  }

  // TODO Check for necessity
  static countTotalCards() {
    this.totalCards = document.querySelectorAll(".card").length;
    return this.totalCards;
  }

  createGame(cols, rows) {
    // Create storage for game information
    let arr = new Array(cols);
    for (let i = 0; i < cols; i++) {
        arr[i] = new Array(rows);
    }

    // Determine needed Symbols and create then
    let totalSymbols;
    if (this.totalCards % 2) totalSymbols = this.totalCards / 2 + .5;
    else totalSymbols = this.totalCards / 2;
    let symbols = new Array(totalSymbols);
    for (let i = 0; i < totalSymbols; i++) {
        symbols[i] = 0x1F600 + i;
    }

    // Fill Array randomly with 2 of every symbol
    for (let i = 0; i < totalSymbols * 2; i++) {
        let buffer = symbols[i % totalSymbols];

        if (i == (totalSymbols * 2 - 1) && this.totalCards % 2) break; // Leave last symbol alone when num of cards is uneven
        let random = Math.floor(this.map(Math.random(), 0, 1, 0, this.totalCards));
        while (arr[(random % cols)][(Math.floor(random / cols))] != undefined) {
            random++;
            if (random == this.totalCards) random = 0;
        }
        arr[(random % cols)][(Math.floor(random / cols))] = buffer;
    }

    debugger;
    return arr;
  }

  // Helperfunction
  map(n, start1, stop1, start2, stop2) {
    const newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
    return newval;
  }


  static handleClick(card) {
    console.log(card);
    if (this.secondTry) {
        this.flipCard(card);
        this.firstCard = card;
        this.secondTry = false;
    }
    else {
      if (!(this.firstCard == card)) {
        this.flipCard(card);
        // FIXME check actual sign not the inner Text
        if (this.firstCard.innerText == card.innerText) { // Player found 2 matching cards
            this.points[player_turn] += 1;
            console.log('Score for Player' + this.player_turn);

            sleep(800)
                .then(() => { this.hide(this.firstCard) })
                .then(() => { this.hide(card) })
                ;
            if (checkGameOver()) this.gameOver = true;

        } else { // Player didn´t found a pair
            this.player_turn++;
            if (this.player_turn == this.players) this.player_turn = 0;

            sleep(1000)    // FIXME use flipCard() instead
                .then(() => { this.firstCard.innerText = '' })
                .then(() => { card.innerText = '' })
                ;
        }
        this.firstTry = true;
      }
    }
  }
}

// Board must be created to set up the game
class Board {
  constructor(c, r) {
    this.rows = new Array(r);
    for (let i = 0; i < r; i++) {
      this.rows[i] = this.createRow(Number(i));
    }

    this.board = new Array(c);
    for (let i = 0; i < c; i++) this.board[i] = new Array(r);
    for (let x = 0; x < c; x++) {
      for (let y = 0; y < r; y++) {
        this.board[x][y] = new Card(x, y);
        this.rows[y].appendChild(this.board[x][y].card);
      }
    }
  }

  createRow(n) {
    let newRow = document.createElement("div");
    let rowClass = document.createAttribute("class");
    rowClass.value = "row-" + (n + 1);
    newRow.setAttributeNode(rowClass);

    this.gameboard.appendChild(newRow);
    return newRow;
  }
}

class Card {
  constructor(x, y) {
    this.value = "";
    this.card = document.createElement("div");

    // FIXME use setAttribute() instead of lines below
    let cardClass = document.createAttribute("class");
    cardClass.value = "col-" + (x + 1) + " " + "card";
    this.card.setAttributeNode(cardClass);
    cardClass = document.createAttribute("onClick");
    cardClass.value = "Game_Memory.handleClick(this)"; // FIXME use () => {} writing
    this.card.setAttributeNode(cardClass);

    let content = document.createTextNode('');
    this.card.appendChild(content);
  }
}