
console.log("reversi");
/** @type{HTMLCanvasElement} */
let canvas = document.getElementById("maincanvas");
let scorePlayer1Container = document.getElementById("scorePlayer1");
let scorePlayer2Container = document.getElementById("scorePlayer2");
let finalcontainer = document.getElementById("finalScore");
let button = document.getElementById("resetGame");

function draw() {
  let surface = canvas.getContext("2d");
  surface.beginPath();
  surface.strokeStyle = "cyan";
  surface.lineWidth = 3;
  surface.moveTo(0, 0);
  surface.lineTo(800, 0);
  surface.lineTo(800, 800);
  surface.lineTo(0, 800);
  surface.lineTo(0, 0);
  surface.fillStyle = "pink";
  surface.fill();
  for (let i = 0; i <= 8; i++) {
    surface.beginPath();
    surface.moveTo(100 * i, 0);
    surface.lineTo(100 * i, 800);
    surface.stroke();

    surface.beginPath();
    surface.moveTo(0, 100 * i);
    surface.lineTo(800, 100 * i);
    surface.stroke();
  }
  drawpart2();
  let allLegalMoves = findAllMoves();
  if (player1turn) {
    surface.strokeStyle = player1color;
  } else {
    surface.strokeStyle = player2color;
  }
  for (let i = 0; i < allLegalMoves.length; i++) {
    let move = allLegalMoves[i];
    let row = move[0];
    let column = move[1];
    surface.beginPath();

    let x = column * 100 + 50;
    let y = row * 100 + 50;
    surface.arc(x, y, 47.5, 0, 6.28);
    surface.stroke();
  }
  let score = computeScore();
  if (allLegalMoves.length === 0) {
    let scorePlayer1 = score[0];
    let scorePlayer2 = score[1];
    let winString = "";
    let color = "blue";
    if (scorePlayer1 > scorePlayer2) {
      winString = "Player 1 wins!";
      color = player1color;
    } else if (scorePlayer2 > scorePlayer1) {
      winString = "Player 2 wins!";
      color = player2color;
    } else {
      winString = "Draw!";
      color = "blue";
    }
    writeFinalScore(winString, color);
  } else if (thereWasAPass) {
    if (player1turn) {
      writeFinalScore("player 2 must pass", player1color);
    } else {
      writeFinalScore("player 1 must pass", player2color);
    }
  } else {
    writeFinalScore("", "black");
  }
}

function writeFinalScore(score, color) {
  finalcontainer.innerHTML = score;
  if (color === "white") {
    color = "gray";
  }
  finalcontainer.style.color = color;

}

function computeScore() {
  let scorePlayer1 = 0;
  let scorePlayer2 = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (board[i][j] === "1") {
        scorePlayer1++;
      } else if (board[i][j] === "2") {
        scorePlayer2++;
      }

    }
  }
  scorePlayer1Container.innerHTML = scorePlayer1;
  scorePlayer2Container.innerHTML = scorePlayer2;
  return [scorePlayer1, scorePlayer2];
}

function drawpart2() {
  let surface = canvas.getContext("2d");
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let turn = board[i][j];
      let color = "";
      if (turn === "1") {
        color = player1color;
      } if (turn === "2") {
        color = player2color;
      }
      if (color !== "") {
        surface.beginPath();
        surface.fillStyle = color;
        let x = (100 * j) + 50;
        let y = (100 * i) + 50;
        let animationstate = animationLayer[i][j];
        surface.arc(x, y, 47.5 - animationstate, 0, 6.28);
        surface.fill();
      }
    }
  }

}

let player1StartedFirst = true;
let player1turn = player1StartedFirst;
let thereWasAPass = false;
let player1color = "white";
let player2color = "black";
let board = [
  ["", "", "", "", "", "", "", "",],
  ["", "", "", "", "", "", "", "",],
  ["", "", "", "", "", "", "", "",],
  ["", "", "", "1", "2", "", "", "",],
  ["", "", "", "2", "1", "", "", "",],
  ["", "", "", "", "", "", "", "",],
  ["", "", "", "", "", "", "", "",],
  ["", "", "", "", "", "", "", "",],
];
let animationLayer = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

function resetGame() {
  thereWasAPass = false;
  board = [
    ["", "", "", "", "", "", "", "",],
    ["", "", "", "", "", "", "", "",],
    ["", "", "", "", "", "", "", "",],
    ["", "", "", "1", "2", "", "", "",],
    ["", "", "", "2", "1", "", "", "",],
    ["", "", "", "", "", "", "", "",],
    ["", "", "", "", "", "", "", "",],
    ["", "", "", "", "", "", "", "",],
  ];
  animationLayer = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ];
  player1StartedFirst = !player1StartedFirst;
  player1turn = player1StartedFirst;
  draw();
}

button.addEventListener("click", function () {
  resetGame();
});

function printboard() {
  for (let i = 0; i < 8; i++) {
    console.log(board[i]);
  }
}


let framedelay = 20;
function canvasclick(/** @type{MouseEvent} */ e) {
  let b = canvas.getBoundingClientRect();
  let x = e.clientX - b.left;
  let y = e.clientY - b.top;
  let row = Math.floor(y / 100);
  let column = Math.floor(x / 100);
  boardclick(row, column);
}

function boardclick(row, column) {
  let allflips = findAllFlipsPerOneMove(row, column);
  if (allflips.length === 0) {
    return;
  }
  let turn = "";
  if (player1turn) {
    player1turn = false;
    turn = "1";
  } else {
    turn = "2";
    player1turn = true;
  }
  for (let i = 0; i < allflips.length; i++) {
    let flip = allflips[i];
    let currentRow = flip[0];
    let currentcolumn = flip[1];
    board[currentRow][currentcolumn] = turn;
    animationLayer[currentRow][currentcolumn] = 40;
  }
  animationLayer[row][column] = 30;
  if (findAllMoves().length === 0) {
    player1turn = !player1turn;
    thereWasAPass = true;
  } else {
    thereWasAPass = false;
  }

  draw();
  setTimeout(() => {
    animate();
  }, framedelay);
}

function animate() {
  let foundSomethingWorthAnimating = false;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let animationstate = animationLayer[i][j];
      animationstate = animationstate - 2;
      if (animationstate > 0) {
        foundSomethingWorthAnimating = true;
      }
      if (animationstate < 0) {
        animationstate = 0;
      }
      animationLayer[i][j] = animationstate;

    }
  }
  draw();
  if (foundSomethingWorthAnimating) {
    setTimeout(() => {
      animate();
    }, framedelay);
  }
}

function findAllMoves() {
  let result = [];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let flips = findAllFlipsPerOneMove(i, j);
      if (flips.length > 0) {
        result.push([i, j]);
      }
    }
  }
  return result;
}

/** Finds all the flips that happen when we click row, column. */
function findAllFlipsPerOneMove(row, column) {
  let result = [];
  if (board[row][column] !== "") {
    return result;
  }
  findAllFlipsInDirection(row, column, -1, -1, result);
  findAllFlipsInDirection(row, column, 0, -1, result);
  findAllFlipsInDirection(row, column, 1, -1, result);
  findAllFlipsInDirection(row, column, -1, 0, result);
  findAllFlipsInDirection(row, column, -1, 1, result);
  findAllFlipsInDirection(row, column, 1, 1, result);
  findAllFlipsInDirection(row, column, 0, 1, result);
  findAllFlipsInDirection(row, column, 1, 0, result);

  return result;
}

function findAllFlipsInDirection(startRow, startColumn, rowchange, columnchange, result) {
  let activeplayer = "2";
  let otherplayer = "1";
  if (player1turn) {
    activeplayer = "1";
    otherplayer = "2";
  }
  let r = startRow + rowchange;
  let c = startColumn + columnchange;
  if (!isLegalposition(r, c)) {
    return;
  }
  if (board[r][c] !== otherplayer) {
    return;
  }
  let maybeflips = [[startRow, startColumn], [r, c]];
  while (true) {
    r = r + rowchange;
    c = c + columnchange;
    if (!isLegalposition(r, c)) {
      return;
    }
    if (board[r][c] === "") {
      return;
    }
    if (board[r][c] === otherplayer) {
      maybeflips.push([r, c]);
    }
    if (board[r][c] === activeplayer) {
      break;
    }
  }
  for (let i = 0; i < maybeflips.length; i++) {
    result.push(maybeflips[i]);
  }
}

function isLegalposition(row, column) {
  if (row < 0) {
    return false;
  }
  if (column < 0) {
    return false;
  }
  if (row > 7) {
    return false;
  }
  if (column > 7) {
    return false;
  }
  return true;
}

canvas.addEventListener("click", canvasclick);
draw();
let player1IsComputer = false;
let player2IsComputer = true;

setInterval(() => {
  computerMove();
}, 1500);

function computerMove() {
  if (player1turn) {
    if (!player1IsComputer) {
      return
    }
  }
  if (!player1turn) {
    if (!player2IsComputer) {
      return
    }
  }
  let allMoves = findAllMoves();
  let dice = Math.random();
  dice = dice * allMoves.length;
  dice = Math.floor(dice);
  if (dice < 0) {
    return;
  }
  if (dice >= allMoves.length) {
    return;
  }
  let move = allMoves[dice];
  boardclick(move[0], move[1]);
}
function setevelynsScheme() {
  player1color = "red";
  player2color = "blue";
  draw();
}
function setemilysScheme() {
  player1color = "white";
  player2color = "black";
  draw();
}
let emilysRadio = document.getElementById("emilysScheme");
emilysRadio.addEventListener("click", setemilysScheme);

let evelynsRadio = document.getElementById("evelynsScheme");
evelynsRadio.addEventListener("click", setevelynsScheme);
