'use strict'
var gBoard = [];
const MINE = '💣'
const FLAG = '🚩'
window.addEventListener("contextmenu", e => e.preventDefault());
var gGame;
var countLives;
var gMinesCount;
var gLevel;
var gSize = 4;
var mines = 2;
var gMines;
var gElTable;
var gElSmiley;
var gStart;
var gIntervalId;
var elLives = document.querySelector(`p span`);
var elTimer = document.querySelector('button span');
gLevel = {
    SIZE: 4,
    MINES: 2
};

gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function initGame() {
    gElTable = document.querySelector('.board');
    gElSmiley = document.querySelector('.reset');
    gSize = gLevel.SIZE;
    gMines = gLevel.MINES;
    gGame.secsPassed = (gGame.isOn) ? timer() : ''
    gBoard = buildBoard(gSize);
    renderBoard(gBoard);
    countLives = 3;
    elLives.innerText = '❤ ❤ ❤'
}


function setLevel(level) {
    gLevel.SIZE = level;
    initGame()

}

function setMines(nimes) {
    gLevel.MINES = nimes;
    initGame()
}


function buildBoard(gSize) {
    var board = [];
    for (var i = 0; i < gSize; i++) {
        board[i] = [];
        for (var j = 0; j < gSize; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }

            if (i == 1 && j == 2 || i == 3 && j == 2) {
                cell.isMine = true;
            }
            // if (j > 0 && j < gMines) {

            // }
            board[i][j] = cell;
        }
    }
    return board;
}

var posMine = drawNum();
console.log('posMine', posMine);

function setMinesNegsCount(cellI, cellJ, board) {
    gMinesCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i > board.length - 1) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j > board[i].length - 1) continue;
            if (i === cellI && j === cellJ) continue;

            if (board[i][j].isMine) gMinesCount++;
        }
    }
    return gMinesCount;
}


function renderBoard(board) {
    var str = `<tbody>`;
    for (var i = 0; i < board.length; i++) {
        str += `<tr>`;
        for (var j = 0; j < board.length; j++) {
            var className = `cell cell${i}-${j}`;
            str += `<td class="${className}" onMouseDown="cellClicked(event,this,${i},${j})"> </td>`
        }
        str += `</tr>`
    }
    str += `</tbody>`
    gElTable.innerHTML = str;
}


function cellClicked(ev, elCell, i, j) {

    gBoard[i][j].minesAroundCount = setMinesNegsCount(i, j, gBoard)
    console.log('elCell', elCell);
    if (ev.which === 3) {
        cellMarked(elCell, i, j)
    }
    if (ev.which === 1) {

        if (!gGame.isOn) {
            if (gBoard[i][j].isMine) return
            else {
                gGame.isOn = true;
                console.log('gGame.isOn ', gGame.isOn);
                timer();
            }
        }
        if (gGame.isOn) {

            if (gBoard[i][j].isMine) {
                countLives--;
                setLives(countLives);
                elCell.innerText = MINE;
                gElSmiley.innerText = '😰'
                checkGameOver();
                gBoard[i][j].isShown = true;
                gGame.shownCount++


            } else if (gBoard[i][j].minesAroundCount === 0) {
                gBoard[i][j].isShown = true;
                elCell.innerText = ' ';
                elCell.classList.add('checked')
                gElSmiley.innerText = '🙂'
                renderNegs(gBoard, i, j);


            } else if (gBoard[i][j].minesAroundCount > 0) {
                elCell.innerText = gBoard[i][j].minesAroundCount;
                console.log('elCell', elCell);
                gBoard[i][j].isShown = true;
                gGame.shownCount++
                gElSmiley.innerText = '🙂'
                elCell.classList.add('checked');

            }
        }
    }
}
// recursion
// function expandShown(board, elCell, idx, jdx) 

function renderNegs(board, idx, jdx) {
    var negsCount = setMinesNegsCount(i, j, gBoard)
    for (var i = idx - 1; i <= idx + 1; i++) {
        console.log('first for');
        if (i < 0 || i > board.length - 1) continue;
        for (var j = jdx - 1; j <= jdx + 1; j++) {
            if (j < 0 || j > board.length - 1) continue;
            if (i === idx && j === jdx) continue;
            var elCellNeg = document.querySelector(`.board .cell${i}-${j}`);
            console.log('elCellNeg', elCellNeg, i, j);
            if (!elCellNeg.innerText) continue;
            elCellNeg.innerText = (negsCount === 0) ? ' ' : negsCount;
            gBoard[i][j].isShown = true;
            gGame.shownCount++
            elCellNeg.classList.add('checked')
        }
    }
}

function reset() {
    clearInterval(gIntervalId);
    gGame.isOn = false;
    gElSmiley.innerText = '😃'
    initGame();
}

function cellMarked(elCell, i, j) {
    window.addEventListener("contextmenu", e => e.preventDefault());
    gBoard[i][j].isMarked = true;
    elCell.innerText = FLAG;
    gBoard[i][j].isShown = true;
    gGame.markedCount++
    gGame.shownCount++
}


function checkGameOver() {
    if (countLives === 0) {
        gameOver();
        return;
    }
    if (gGame.markedCount === gMines || gGame.shownCount === gLevel ** 2) {
        console.log('victory');
        gameOver();
    }
}

function gameOver() {
    clearInterval(gIntervalId);
}

function setLives(countLives) {
    elLives = document.querySelector(`p span`);
    console.log('elLives', elLives);
    var str = '';
    for (var i = 0; i < countLives; i++) {
        str += '❤'
    }
    elLives.innerText = str;
}
function timer() {
    gStart = Date.now();
    console.log('gStart', gStart);

    gIntervalId = setInterval(function () {

        var miliSecs = Date.now() - gStart

        elTimer.innerHTML = ((miliSecs) / 1000).toFixed(3)
    }, 10)
}

function drawNum() {
    var emptyMines = [];
    emptyMines = getRandomEmptyCell(gBoard);
    console.log('emptyMines', emptyMines);
    var idx = getRandomInt(0, emptyMines.length)
    var pos = emptyMines[idx]
    emptyMines.splice(idx, 1)
    return pos
}

function getRandomEmptyCell(gBoard) {
    var emptyCells = [];
    for (var i = 0; i < gBoard.length; i++) {
        console.log('fisr for');
        console.log('fisr for');
        console.log('fisr for');
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isMine !== MINE) {
                emptyCells.push({ i, j });
            }
        }
    }
    console.log('emptyCells', emptyCells);
    return emptyCells;
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}