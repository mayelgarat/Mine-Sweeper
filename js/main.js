'use strict'
var gBoard = [];
const MINE = '💣'
const FLAG = '🚩'
window.addEventListener("contextmenu", e => e.preventDefault());
var gGame;
var countLives;
var gMinesCount;
var gLoseCount;
var gLevel;
var gSize = 4;
var mines = 2;
var gMines;
var gElTable;
var gElSmiley = document.querySelector('.reset-btn');
var gStart;
var countChecked;
var gSafeClickCount;
var gIntervalId;
var elLives = document.querySelector(`p span`);
var elTimer = document.querySelector('.time span');
var elModal = document.querySelector('.modal span');



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
    gSafeClickCount = 3;
    elModal.style.display = 'none';
    gGame.isOn = false;
    clearInterval(gIntervalId);
    countChecked = 0;
    gElTable = document.querySelector('.board');
    gElSmiley.innerText = '😀'
    gSize = gLevel.SIZE;
    gMines = gLevel.MINES;
    gGame.secsPassed = (gGame.isOn) ? timer() : ''
    gBoard = buildBoard(gSize);
    addMines();
    renderBoard(gBoard);
    countLives = 3;
    elLives.innerText = '❤ ❤ ❤'
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gLoseCount = 0;
    renderSafeClick();
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
            board[i][j] = cell;
        }
    }
    return board;
}

function addMine() {
    var posMine = drawNum();
    gBoard[posMine.i][posMine.j].isMine = true;
}

function addMines() {
    for (var i = 0; i < gMines; i++) {
        addMine();
    }
}

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
    if (!gBoard[i][j].isShown || gBoard[i][j].isMine || gBoard[i][j].isMarked) {


        if (ev.which === 3) {
            cellMarked(elCell, i, j)
        }

    }
    if (ev.which === 1) {
        if (gBoard[i][j].isMarked) {
            gGame.isMarked--
            gBoard[i][j].isMarked = !gBoard[i][j].isMarked
        }
        if (!gGame.isOn) {
            if (gBoard[i][j].isMine) return
            else {
                gGame.isOn = true;
                timer();
            }
        }
        if (gGame.isOn) {
            if (gBoard[i][j].isMine) {
                countLives--;
                elCell.innerText = MINE;
                gElSmiley.innerText = '😰'
                gGame.shownCount++
                gBoard[i][j].isShown = true;
                if (countLives == 0) revelMine();
                setLives(countLives);
            } else if (gBoard[i][j].minesAroundCount === 0) {
                // elCell.innerText = ' ';
                expandShown(gBoard, elCell, i, j);
            } else if (gBoard[i][j].minesAroundCount > 0) {
                elCell.innerText = gBoard[i][j].minesAroundCount;
                gBoard[i][j].isShown = true;
                gGame.shownCount++
                gBoard[i][j].isShown = true;
            }
            // gElSmiley.innerText = '🙂'
            elCell.classList.add('checked');
            checkGameOver();
        }
    }
}


function expandShown(board, elCell, idx, jdx) {

    if (idx < 0 || jdx < 0 ||
        idx > board.length ||
        jdx > board.length ||
        elCell.innerText === MINE) return;

    for (var i = idx - 1; i <= idx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue;
        for (var j = jdx - 1; j <= jdx + 1; j++) {
            if (j < 0 || j > board.length - 1) continue;
            // if (i === idx && j === jdx) continue;
            if (gBoard[i][j].isShown) continue;
            if (gBoard[i][j].isMine) continue
            var elCellNeg = document.querySelector(`.board .cell${i}-${j}`);
            var negsCount = setMinesNegsCount(i, j, gBoard)
            elCellNeg.innerText = (negsCount !== 0) ? negsCount : ' ';
            gBoard[i][j].isShown = true;
            // console.log(' gBoard[i][j].isShown ', i, j, gBoard[i][j].isShown);
            gGame.shownCount++
            elCellNeg.classList.add('checked')

        }
    }
    expandShown(board, elCellNeg, i, j)
}

function renderSafeClick() {
    var elDivBtn = document.querySelector(`.div-safe span`)
    var str = '';
    for (var i = 0; i < gSafeClickCount; i++) {
        str += '💡'
    }
    if (gSafeClickCount < 0) {
        var elSafeCell = document.querySelector(`.board .cell${randIdx.i}-${randIdx.j}`);
        elSafeCell.classList.remove('safe');
    }
    elDivBtn.innerHTML = str;
}


function safeClick() {
    gSafeClickCount--;
    renderSafeClick();
    var randIdx = drawNum();
    var elSafeCell = document.querySelector(`.board .cell${randIdx.i}-${randIdx.j}`);
    elSafeCell.classList.add('safe');
    setTimeout(function () {
        elSafeCell.classList.remove('safe');
    }, 500)
}


function revelMine() {
    console.log('revelMine');
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isMine) {
                var elMine = document.querySelector(`.cell${i}-${j}`)
                elMine.innerText = MINE;
                elMine.classList.add('checked');
            }
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
    gBoard[i][j].isMarked = (!gBoard[i][j].isMarked)
    gBoard[i][j].isShown = (!gBoard[i][j].isShown);

    if (gBoard[i][j].isMarked) {
        elCell.innerText = FLAG;
        gGame.markedCount++

    } else {
        elCell.innerText = ' '
        gGame.markedCount--
        gGame.shownCount--;
    }
    if (gBoard[i][j].isMine) {
        gGame.shownCount = gGame.shownCount;
    }
    if (gBoard[i][j].isShown) {
        gGame.shownCount++
    }
    if (elCell.classList.contains('checked')) elCell.classList.remove('checked');

    checkGameOver();
}


function checkGameOver() {
    if (countLives === 0 || gLoseCount === gMines) {
        elModal.innerText = 'You Lost... Maybe Next Time 💔'
        elModal.style.display = 'block';
        gameOver();
        return;
    }
    if ((gGame.shownCount === gLevel.SIZE ** 2 && gGame.markedCount === gMines)) {
        elModal.innerText = 'You Win! Congratulation 💥'
        gElSmiley.innerText = '😎'
        elModal.style.display = 'block';
        gameOver();
        return;
    }
}

function gameOver() {
    clearInterval(gIntervalId);
}

function setLives(countLives) {
    elLives = document.querySelector(`p span`);
    var str = '';
    for (var i = 0; i < countLives; i++) {
        str += '❤'
    }
    elLives.innerText = str;
}

function timer() {
    gStart = Date.now();
    gIntervalId = setInterval(function () {
        var miliSecs = Date.now() - gStart
        elTimer.innerHTML = ((miliSecs) / 1000).toFixed(1)
    }, 100)
}

function drawNum() {
    var emptyMines = [];
    emptyMines = getRandomEmptyCell(gBoard);
    var idx = getRandomInt(0, emptyMines.length)
    var pos = emptyMines[idx]
    emptyMines.splice(idx, 1)
    return pos
}

function getRandomEmptyCell() {
    var emptyCells = [];
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (!gBoard[i][j].isMine && !gBoard[i][j].isShown) {
                emptyCells.push({
                    i: i,
                    j: j
                })
            }
        }
    }
    return emptyCells;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}