function map(n, start1, stop1, start2, stop2) {
    const newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
    return newval;
};

let cols = 3;
let rows = 2;
let totalCards = rows * cols;
let gameboard = document.querySelector('#gameboard');
let players = 2;
let player_turn = 0;
let points = new Array(players);
for (i = 0; i < points.length; i++) points[i] = 0;
let firstTry = true;
let gameOver = false;

// Create storage for game information
let arr = new Array();
for (let i = 0; i < cols; i++) {
    arr[i] = new Array();
}

// Determine needed Symbols and create then
let totalSymbols;
if (totalCards % 2) totalSymbols = totalCards/2 + .5;
else totalSymbols = totalCards/2;
let symbols = new Array(totalSymbols);
for (let i = 0; i < totalSymbols; i++) {
    symbols[i] = 0x1F600+i;
}

for (let i = 0; i < totalSymbols*2; i++) { // Fill Array randomly with 2 of every symbol
    let buffer = symbols[i%totalSymbols];

    if (i == (totalSymbols*2-1) && totalCards % 2) break; // Leave last symbol alone when num of cards is uneven
    let random = Math.floor(map(Math.random(), 0, 1, 0, totalCards));
    while (arr[(random % cols)][(Math.floor(random / cols))] != undefined) {
        random++;
        if (random == totalCards) random = 0;
    }
    arr[(random % cols)][(Math.floor(random / cols))] = buffer;
}

function checkGameOver() {
    let collectedPoints = 0;
    // Count the collected points
    for (let i in points) {
        collectedPoints += points[i];
    }

    // Turn points into cards and add one in case there is one trick card
    collectedPoints *= 2;
    if (totalCards % 2) collectedPoints++;

    // Check if all cards are already collected
    if (collectedPoints == totalCards) return true;
    else return false;
}

function handleClick(card) { // TODO consider gameOver
    if (firstTry) {
        flipCard(card);
        firstCard = card;
        firstTry = false;
    }
    else {
        if (!(firstCard == card)) {
            flipCard(card);
            // FIXME check actual sign not the inner Text
            if (firstCard.innerText == card.innerText) { // Player found 2 matching cards
                points[player_turn] += 1;
                console.log('Score for Player' + player_turn);

                sleep(800)
                    .then(() => {hide(firstCard)})
                    .then(() => {hide(card)})
                ;
                if (checkGameOver()) gameOver = true;

            } else { // Player didn´t found a pair
                player_turn++;
                if (player_turn == players) player_turn = 0;

                sleep(1000)
                    .then(() => {firstCard.innerText = ''})
                    .then(() => {card.innerText = ''})
                ;
            }
            firstTry = true;
        }
    }
}

function countTotalCards() {
    let totalCards = document.querySelectorAll('.card').length;
    return totalCards;
}



function flipCard(cell) {
    if (cell.innerText == '') {
        let pos;
        let row = cell.parentElement.className;
        pos = row.search('row-');
        row = Number(row.slice(pos+4, pos+5));
        let col = cell.className;
        pos = col.search('col-');
        col = Number(col.slice(pos+4, pos+5));
        cell.innerText = String.fromCodePoint(arr[col-1][row-1]);
    }
    else cell.innerText = '';
}

function hide(cell) {
    cell.className += ' ' + 'hidden';
}

function blockInput() {
    // TODO create div to block input
}

function removeInputBlock() {
    // TODO remove input block
}

// Sleep function for delay (sleep().then([function]()))
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



for (let r = 0; r < rows; r++) {
    let newRow = document.createElement('div');
    let rowClass = document.createAttribute('class');
    rowClass.value = 'row-' + (r+1);
    newRow.setAttributeNode(rowClass);

    for (let c = 0; c < cols; c++) {
        let newCell = document.createElement('div');

        let cellClass = document.createAttribute('class');
        cellClass.value = 'col-' + (c+1) + ' ' + 'card';
        newCell.setAttributeNode(cellClass);
        cellClass = document.createAttribute('onClick');
        cellClass.value = 'handleClick(this)'; // TODO call game clickHandler
        newCell.setAttributeNode(cellClass);

        let content = document.createTextNode('');
        newCell.appendChild(content);

        newRow.appendChild(newCell);
    }
    gameboard.appendChild(newRow);
}

