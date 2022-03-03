"use strict";

//----------VARIABLES----------//

let gridSize = 4;
let tileArray1 = new Array(); // 2D array to reflect the value of each tile
let tileArray2 = new Array(); // 2D array to reflect the value of each tile
let winningLevel = 11; //  11-2048   10-1024   9-512   8-256   7-128   6-64
let players = [1, 2];
let moveCounter1 = 0; //move counter
let score1 = 0; // score counter
let moveCounter2 = 0; //move counter
let score2 = 0; // score counter
let currentGame = {
  player1: { moves: 0, score: 0, goal: 0, tileArray: 0 },
  player2: { moves: 0, score: 0, goal: 0, tileArray: 0 },
};
let highScoreArray = [];
let gameModeArray = ["Classic", "Time Attack", "Dual"];
let locationArray = ["index.html", "time.html", "dual.html"];
const localStorage = window.localStorage;
const localGame = localStorage.currentGameDual;
const localHighscore = localStorage.highScore;
const banner = document.querySelector("#banner"); //banner is used to display winner or game over message
const statusBar = document.querySelector("#statusbar");
const settings = document.querySelector("#settings");
const board1 = document.querySelector("#board1");
const board2 = document.querySelector("#board2");
//----------FUNCTIONS----------//

function createDiv(y, x, value, player) {
  // Create .tile divisions with id tile coordinates and append to .board

  let tile = document.createElement("div");
  tile.innerText = 2 ** value;
  tile.className = "tile";
  tile.id = `p${player}tile${y}${x}`;
  document.querySelector(`#board${player}`).append(tile);
}

function checkKey(e) {
  // check the keyvalue of event and call move function
  let dir = "";
  let player = 0;

  if (e.key == "ArrowUp") {
    // up arrow
    dir = "up";
    player = 2;
  } else if (e.key == "ArrowDown") {
    // down arrow
    dir = "down";
    player = 2;
  } else if (e.key == "ArrowLeft") {
    // left arrow
    dir = "left";
    player = 2;
  } else if (e.key == "ArrowRight") {
    // right arrow
    dir = "right";
    player = 2;
  } else if (e.key == "w") {
    dir = "up";
    player = 1;
  } else if (e.key == "s") {
    // down arrow
    dir = "down";
    player = 1;
  } else if (e.key == "a") {
    // left arrow
    dir = "left";
    player = 1;
  } else if (e.key == "d") {
    // right arrow
    dir = "right";
    player = 1;
  }

  if (dir) move(dir, true, player);
  // calls move function with the respective direction. 2nd arg = true as it is from a keyboard event
}

function move(dir, playerMove, player) {
  // this function takes the input of the move and check if it is a player move or computer move
  let hasMove = false; // hasMove is to determine if there is a change in tile positions after the move.

  for (let i = 0; i < gridSize; i++) {
    //loop through adjacent directions
    let directionArray = []; // directionArray refers to the single column or row of levels
    for (let j = 0; j < gridSize; j++) {
      if (player === 1) {
        if (dir === "up" || dir === "down")
          directionArray.push(tileArray1[j][i]);
        //directionArray set to read columns for updown directions
        else if (dir === "left" || dir === "right")
          directionArray.push(tileArray1[i][j]); // directionArray set to read rows for leftright directions
      } else if (player === 2) {
        if (dir === "up" || dir === "down")
          directionArray.push(tileArray2[j][i]);
        //directionArray set to read columns for updown directions
        else if (dir === "left" || dir === "right")
          directionArray.push(tileArray2[i][j]); // directionArray set to read rows for leftright directions
      }
    }
    if (dir === "down" || dir === "right") directionArray.reverse(); // reversing the array to checkMerge and gravity if right/down
    directionArray = gravity(directionArray);
    directionArray = checkMerge(directionArray, player);
    directionArray = gravity(directionArray);
    if (dir === "down" || dir === "right") directionArray.reverse(); // reversing it back
    for (let j = 0; j < gridSize; j++) {
      if (player === 1) {
        if (dir === "up" || dir === "down") {
          if (tileArray1[j][i] != directionArray[j]) hasMove = true; // setting the hasmove condition if there is tile movement
          if (playerMove) tileArray1[j][i] = directionArray[j]; // updating tileArray with new merged and gravitied column array (updown)
        } else if (dir === "left" || dir === "right") {
          if (tileArray1[i][j] != directionArray[j]) hasMove = true;
          if (playerMove) tileArray1[i][j] = directionArray[j]; // similar, leftright
        }
      } else if (player === 2) {
        if (dir === "up" || dir === "down") {
          if (tileArray2[j][i] != directionArray[j]) hasMove = true; // setting the hasmove condition if there is tile movement
          if (playerMove) tileArray2[j][i] = directionArray[j]; // updating tileArray with new merged and gravitied column array (updown)
        } else if (dir === "left" || dir === "right") {
          if (tileArray2[i][j] != directionArray[j]) hasMove = true;
          if (playerMove) tileArray2[i][j] = directionArray[j]; // similar, leftright
        }
      }
    }
  }

  if (playerMove) {
    if (player === 1) {
      // if its a player move
      if (hasMove) {
        // and move is valid
        moveCounter1++; // increse move counter
        sprawn(1); // sprawn a new tile
        // showDirection(dir);
        winnerCheck(1); // check if there are any winning tiles
      } else if (checkEmptyTile(1).length === 0) gameOverCheck(1); //if there are no empty tiles, execute gameOverCheck
    } else if (player === 2) {
      // if its a player move
      if (hasMove) {
        // and move is valid
        moveCounter2++; // increse move counter
        sprawn(2); // sprawn a new tile
        // showDirection(dir);
        winnerCheck(2); // check if there are any winning tiles
      } else if (checkEmptyTile(2).length === 0) gameOverCheck(2); //if there are no empty tiles, execute gameOverCheck
    }
  } else {
    // if its a computer move
    return hasMove; // return if there is move or not
  }
}

function showDirection(dir) {
  let directionCard = document.querySelector("#direction");
  if (dir == "up") directionCard.innerHTML = "&#8593";
  else if (dir == "down") directionCard.innerHTML = "&#8595";
  else if (dir == "left") directionCard.innerHTML = "&#8592";
  else if (dir == "right") directionCard.innerHTML = "&#8594";

  reset_animation();
}

function reset_animation() {
  var el = document.getElementById("direction");
  el.style.animation = "none";
  el.offsetHeight; /* trigger reflow */
  el.style.animation = null;
}

function checkMerge(array, player) {
  // check if the input array has adjacent elements of the same value
  for (let i = 0; i < array.length; i++) {
    if (array[i] !== 0) {
      // not appliable to level 0
      if (array[i] === array[i + 1]) {
        // if current element has the same value as next element
        array[i]++; // increase the level of current element
        array[i + 1] = 0; // remove the next element
        if (player === 1) score1 += 2 ** array[i];
        else if (player === 2) score2 += 2 ** array[i];
        // update the score as there is a merge
      }
    }
  }
  return array; // returns the 'merged' array
}

function gravity(array) {
  // flushes input array by removing and pushing 0s to end of array
  for (let i = array.length; i >= 0; i--) {
    if (array[i] === 0) {
      array.splice(i, 1);
      array.push(0);
    }
  }
  return array;
}

function checkEmptyTile(player) {
  // checks for empty tiles
  let emptyTileArray = [];
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      if (player === 1 && tileArray1[y][x] === 0) {
        emptyTileArray.push([y, x]);
      }

      if (player === 2 && tileArray2[y][x] === 0) {
        emptyTileArray.push([y, x]);
      }
    }
  }
  return emptyTileArray;
}

function sprawn(player) {
  // select empty tiles and increase the value of 1 tile at random. updates tileArray and calls updateBoard function
  let emptyTileArray = checkEmptyTile(player);
  let randomIndex = Math.floor(Math.random() * emptyTileArray.length);
  let sprawnTile = emptyTileArray[randomIndex];
  if (player === 1) {
    tileArray1[sprawnTile[0]][sprawnTile[1]]++;
  }
  // increase level of tile
  else if (player === 2) {
    tileArray2[sprawnTile[0]][sprawnTile[1]]++;
  } // increase level of tile

  updateBoard();
}

function updateBoard() {
  // updates moves and score and 'redraws' the board with reference to tileArray

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      let tile1 = document.querySelector(`#p1tile${y}${x}`);
      if (tileArray1[y][x] != 0) tile1.innerText = 2 ** tileArray1[y][x];
      else if (tileArray1[y][x] == 0) tile1.innerText = "";
      else console.log(`error in update board 1 `);
      tile1.className = `l${tileArray1[y][x]}`; //l stands for level
      tile1.classList.add("tile");

      let tile2 = document.querySelector(`#p2tile${y}${x}`);
      if (tileArray2[y][x] != 0) tile2.innerText = 2 ** tileArray2[y][x];
      else if (tileArray2[y][x] == 0) tile2.innerText = "";
      else console.log(`error in update board 2`);
      tile2.className = `l${tileArray2[y][x]}`; //l stands for level
      tile2.classList.add("tile");
    }
  }

  document.querySelector("#moves1").innerText = moveCounter1; // update moveCounter
  document.querySelector("#score1").innerText = score1; //update score
  document.querySelector("#moves2").innerText = moveCounter2; // update moveCounter
  document.querySelector("#score2").innerText = score2; //update score
  document.querySelector("#goal").innerText = 2 ** winningLevel; //update score

  // currentGame = {
  //   player1: { moves: 0, score: 0, goal: 0, tileArray: 0 },
  //   player2: { moves: 0, score: 0, goal: 0, tileArray: 0 },
  // };

  currentGame.player1.moves = moveCounter1;
  currentGame.player1.score = score1;
  currentGame.player1.goal = winningLevel;
  currentGame.player1.tileArray = tileArray1;
  currentGame.player2.moves = moveCounter2;
  currentGame.player2.score = score2;
  currentGame.player2.goal = winningLevel;
  currentGame.player2.tileArray = tileArray2;
  localStorage.setItem("currentGameDual", JSON.stringify(currentGame));
}

function gameOverCheck(player) {
  // checks if any moves are possible, otherwise game over
  let possibleToMove = false;
  let moves = ["up", "down", "left", "right"];
  for (let i = 0; i < moves.length; i++) {
    if (move(moves[i], false, player)) possibleToMove = true;
  }
  if (possibleToMove == false) {
    if (player === 1) {
      document.querySelector(
        `#banner1ScoreLabel`
      ).innerText = `Score: ${score1}`;
      document.querySelector("#banner1").style.display = "block";
      setHighScore(1);
    } else if (player === 2) {
      document.querySelector(
        `#banner2ScoreLabel`
      ).innerText = `Score: ${score2}`;
      document.querySelector("#banner2").style.display = "block";
      setHighScore(2);
    }
  }
}

function winnerCheck() {
  // check for winner by looping through tileArray
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (tileArray1[i][j] >= winningLevel) {
        console.log(`p1 won`);
        banner.querySelector("#bannerText").innerText = "PLAYER 1 WIN!";
        banner.style.display = "block";
        document.querySelector(
          "#bannerScoreLabel"
        ).innerText = `Score: ${score1}`;
        document.onkeydown = null;
        setHighScore(1);
        document.querySelector("#replay").addEventListener("click", newGame);
      }
      if (tileArray2[i][j] >= winningLevel) {
        console.log(`p2 won`);
        banner.querySelector("#bannerText").innerText = "PLAYER 2 WIN!";
        banner.style.display = "block";
        document.querySelector(
          "#bannerScoreLabel"
        ).innerText = `Score: ${score2}`;
        document.onkeydown = null;
        setHighScore(2);
        document.querySelector("#replay").addEventListener("click", newGame);
      }
    }
  }
}
function reload() {
  location.reload();
}

function newGame() {
  //set up board based on tile selection, adds key listeners and sprawn initial tile
  document.querySelector("#replay").removeEventListener("click", newGame);
  document.onkeydown = checkKey;
  banner.style.display = "none";
  while (board1.firstChild) {
    board1.removeChild(board1.firstChild);
  }
  while (board2.firstChild) {
    board2.removeChild(board2.firstChild);
  }

  // Setting css columns to match gridSize
  board1.style["grid-template-columns"] = `repeat(${gridSize}, 1fr)`;
  board2.style["grid-template-columns"] = `repeat(${gridSize}, 1fr)`;

  //Creating new div for each tile
  for (let y = 0; y < gridSize; y++) {
    let xArray1 = new Array();
    let xArray2 = new Array();

    for (let i = 0; i < gridSize; i++) {
      xArray1.push(0);
      xArray2.push(0);

      tileArray1[y] = xArray1;
      tileArray2[y] = xArray2;
    }
    for (let x = 0; x < gridSize; x++) {
      createDiv(y, x, tileArray1[y][x], 1);
      createDiv(y, x, tileArray2[y][x], 2);
    }
  }
  //new function getHighScore() which gets highscore from local  and updates DOM
  getHighScore();

  // sprawn initial tile
  sprawn(1);
  sprawn(2);
  moveCounter1 = 0;
  score1 = 0;
  moveCounter2 = 0;
  score2 = 0;
  updateBoard();
}

function resumeGame() {
  document.onkeydown = checkKey;
  gridSize = currentGame.player1.tileArray.length;
  winningLevel = currentGame.player1.goal;
  score1 = currentGame.player1.score;
  moveCounter1 = currentGame.player1.moves;
  tileArray1 = currentGame.player1.tileArray;
  score2 = currentGame.player2.score;
  moveCounter2 = currentGame.player2.moves;
  tileArray2 = currentGame.player2.tileArray;

  board1.style["grid-template-columns"] = `repeat(${gridSize}, 1fr)`;
  board2.style["grid-template-columns"] = `repeat(${gridSize}, 1fr)`;

  for (let y = 0; y < tileArray1.length; y++) {
    for (let x = 0; x < tileArray1.length; x++) {
      createDiv(y, x, tileArray1[y][x], 1);
      createDiv(y, x, tileArray2[y][x], 2);
    }
  }
  getHighScore();
  updateBoard();
  winnerCheck();
}

function toggleSettings() {
  // display and remove the settings panel. sets the respective settings
  // changing existing listener to close panel instead
  settings.removeEventListener("click", toggleSettings);
  settings.addEventListener("click", removeSettingsPage);
  // new setting div with id settingpage
  let settingPage = document.createElement("div");
  settingPage.id = "settingpage";

  let gameModeRow = document.createElement("div");
  gameModeRow.style.display = "flex";
  gameModeRow.className = "selectorDiv";
  for (let i = 0; i < gameModeArray.length; i++) {
    let box = document.createElement("div");
    box.className = "setting-selector";
    box.classList.add("button");
    box.innerText = gameModeArray[i];
    box.display = "inline";
    box.addEventListener("click", (event) => {
      event.target.style.backgroundColor = "#c9986d";
      location.href = locationArray[i];
    });
    gameModeRow.append(box);
  }
  settingPage.append(gameModeRow);

  let set = document.createElement("div");
  set.id = "setDiv";
  set.classList.add("button");
  set.innerText = "NEW GAME";
  set.addEventListener("click", () => {
    document.querySelector("#goal").innerText = 2 ** winningLevel;
    tileArray1 = [];
    tileArray2 = [];
    newGame();
    document.querySelector("#banner1").style = "none";
    document.querySelector("#banner2").style = "none";
    removeSettingsPage();
  });
  settingPage.append(set);
  document.querySelector("#statusbar").append(settingPage);
}

function removeSettingsPage() {
  settings.removeEventListener("click", removeSettingsPage);
  document.querySelector("#settingpage").remove();
  settings.addEventListener("click", toggleSettings);
}

function getHighScore() {
  let highScore = highScoreArray[winningLevel] || 0;
  document.querySelector("#highscore").innerText = highScore;
}

function setHighScore(player) {
  console.log(`test`);
  let score = 0;
  if (
    score1 > highScoreArray[winningLevel] ||
    score2 > highScoreArray[winningLevel]
  ) {
    console.log(`in setting HS`);
    if (score1 > score2) score = score1;
    else score = score2;
    console.log(`score = ${score}`);
    highScoreArray[winningLevel] = score;
    localStorage.setItem("highScore", JSON.stringify(highScoreArray));
    getHighScore();
  }
}

//----------MAIN----------//

// add handling for settings
settings.addEventListener("click", toggleSettings);

if (
  localHighscore === undefined ||
  localHighscore === null ||
  localHighscore.length === 0
) {
  console.log(`there is no local highscore`);
  highScoreArray = new Array(20).fill(0);
  localStorage.setItem("highScore", JSON.stringify(highScoreArray));
} else {
  highScoreArray = JSON.parse(localStorage.highScore);
}

if (localGame === undefined || localGame === null || localGame.length === 0) {
  newGame();
} else {
  currentGame = JSON.parse(localStorage.currentGameDual);
  resumeGame();
}
