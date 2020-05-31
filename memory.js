class Game_Memory {
  constructor(c, r) {
    this.gameboard = document.querySelector("#gameboard");
    this.players = 2;
    this.player_turn = 0;
    this.points = new Array(this.players);
    this.secondTry = false;
    this.gameOver = false;
    this.cols = c;
    this.rows = r;
  }

  handleClick(card) {
    // TODO consider gameOver
    if (!firstTry) {
      this.firstCard = card;
      firstTry = true;
    } else {
      if (this.firstCard.innerText == card.innerText) {
        // Player found 2 matching cards
        this.points[this.player_turn] += 1;
        // TODO setTimeout for hiding
        hide(this.firstCard);
        hide(card);
        if (this.checkGameOver()) this.gameOver = true;
      } else {
        this.firstCard.innerText = "";
        card.innerText = "";
      }
      this.player_turn++;
      if (this.player_turn == this.players) this.player_turn = 0;
    }
  }

  checkGameOver() {
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

  countTotalCards() {
    this.totalCards = document.querySelectorAll(".card").length;
    return this.totalCards;
  }
}

// Board must be created to set up the game
class Board extends Game_Memory {
  constructor(c, r) {
    super(c, r);
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
  /*     createCard(x, y) {
        let card = document.createElement('div');

        let cardClass = document.createAttribute('class');
        cardClass.value = 'col-' + (x+1) + ' ' + 'card';
        card.setAttributeNode(cardClass);
        cardClass = document.createAttribute('onClick');
        cardClass.value = 'console.log(this)'; // TODO call game clickHandler
        card.setAttributeNode(cardClass);

        let content = document.createTextNode((x+y));
        card.appendChild(content);

        debugger;

        this.rows[y].appendChild(card);

        return card;
    } */
}

class Card extends Game_Memory {
  constructor(x, y) {
    super();
    this.value = "";
    this.card = document.createElement("div");

    let cardClass = document.createAttribute("class");
    cardClass.value = "col-" + (x + 1) + " " + "card";
    this.card.setAttributeNode(cardClass);
    cardClass = document.createAttribute("onClick");
    cardClass.value = "this.handleClick(this)"; // TODO call game clickHandler
    this.card.setAttributeNode(cardClass);

    let content = document.createTextNode(x + y);
    this.card.appendChild(content);
  }
}
