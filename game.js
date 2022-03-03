"use strict";

//----------VARIABLES----------//

let gridSize = 4;
let tileArray = []; // 2D array to reflect the value of each tile
let winningLevel = 11; //  11-2048   10-1024   9-512   8-256   7-128   6-64
let moveCounter = 0; //move counter
let score = 0; // score counter
let currentGame = { moves: 0, score: 0, goal: 0, tileArray: 0 };
let highScoreArray = [];
let prevTileArray = [];
let gameModeArray = ["Classic", "Time Attack", "Dual"];
let locationArray = ["index.html", "time.html", "dual.html"];
const localStorage = window.localStorage;
const localGame = localStorage.currentGame;
const localHighscore = localStorage.highScore;
const banner = document.querySelector("#banner"); //banner is used to display winner or game over message
const statusBar = document.querySelector("#statusbar");
const settings = document.querySelector("#settings");
const board = document.querySelector(".board");

//----------FUNCTIONS----------//

function createDiv(y, x, value) {
  // Create .tile divisions with id tile coordinates and append to .board
  let tile = document.createElement("div");
  tile.innerText = 2 ** value;
  tile.className = "tile";
  tile.id = `tile${y}${x}`;

  document.querySelector(".board").append(tile);
}

function checkKey(e) {
  // check the keyvalue of event and call move function
  let dir = "";
  if (e.key == "ArrowUp") {
    // up arrow
    dir = "up";
  } else if (e.key == "ArrowDown") {
    // down arrow
    dir = "down";
  } else if (e.key == "ArrowLeft") {
    // left arrow
    dir = "left";
  } else if (e.key == "ArrowRight") {
    // right arrow
    dir = "right";
  } else if (e.keyCode == "32") {
    //space button
    undo();
  }

  if (dir) move(dir, true);
  // calls move function with the respective direction. 2nd arg = true as it is from a keyboard event
}

function move(dir, playerMove) {
  console.log(`move starting`);
  console.table(tileArray);
  // this function takes the input of the move and check if it is a player move or computer move
  let hasMove = false; // hasMove is to determine if there is a change in tile positions after the move.
  prevTileArray = JSON.parse(JSON.stringify(tileArray));

  for (let i = 0; i < gridSize; i++) {
    //loop through adjacent directions
    let directionArray = []; // directionArray refers to the single column or row of levels
    for (let j = 0; j < gridSize; j++) {
      if (dir === "up" || dir === "down") directionArray.push(tileArray[j][i]);
      //directionArray set to read columns for updown directions
      else if (dir === "left" || dir === "right")
        directionArray.push(tileArray[i][j]); // directionArray set to read rows for leftright directions
    }
    if (dir === "down" || dir === "right") directionArray.reverse(); // reversing the array to checkMerge and gravity if right/down
    directionArray = gravity(directionArray);
    directionArray = checkMerge(directionArray);
    directionArray = gravity(directionArray);
    if (dir === "down" || dir === "right") directionArray.reverse(); // reversing it back
    for (let j = 0; j < gridSize; j++) {
      if (dir === "up" || dir === "down") {
        if (tileArray[j][i] != directionArray[j]) hasMove = true; // setting the hasmove condition if there is tile movement
        if (playerMove) tileArray[j][i] = directionArray[j]; // updating tileArray with new merged and gravitied column array (updown)
      } else if (dir === "left" || dir === "right") {
        if (tileArray[i][j] != directionArray[j]) hasMove = true;
        if (playerMove) tileArray[i][j] = directionArray[j]; // similar, leftright
      }
    }
  }

  if (playerMove) {
    console.log(`player move`);
    // if its a player move
    if (hasMove) {
      // and move is valid
      moveCounter++; // increse move counter
      sprawn(); // sprawn a new tile
      showDirection(dir);
      winnerCheck(); // check if there are any winning tiles
    } else if (checkEmptyTile().length === 0) gameOverCheck(); //if there are no empty tiles, execute gameOverCheck
  } else {
    console.log(`computer move`);
    // if its a computer move
    return hasMove; // return if there is move or not
  }

  console.log(`move ending`);
  console.table(tileArray);
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

function checkMerge(array) {
  // check if the input array has adjacent elements of the same value
  for (let i = 0; i < array.length; i++) {
    if (array[i] !== 0) {
      // not appliable to level 0
      if (array[i] === array[i + 1]) {
        // if current element has the same value as next element
        array[i]++; // increase the level of current element
        array[i + 1] = 0; // remove the next element
        score += 2 ** array[i]; // update the score as there is a merge
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

function checkEmptyTile() {
  // checks for empty tiles
  let emptyTileArray = [];
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      if (tileArray[y][x] === 0) {
        emptyTileArray.push([y, x]);
      }
    }
  }
  return emptyTileArray;
}

function sprawn() {
  // select empty tiles and increase the value of 1 tile at random. updates tileArray and calls updateBoard function
  let emptyTileArray = checkEmptyTile();
  let randomIndex = Math.floor(Math.random() * emptyTileArray.length);
  let sprawnTile = emptyTileArray[randomIndex];
  tileArray[sprawnTile[0]][sprawnTile[1]]++; // increase level of tile
  updateBoard();
}

function updateBoard() {
  // updates moves and score and 'redraws' the board with reference to tileArray
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      let tile = document.querySelector(`#tile${y}${x}`);
      if (tileArray[y][x] != 0) tile.innerText = 2 ** tileArray[y][x];
      else if (tileArray[y][x] == 0) tile.innerText = "";
      else console.log(`error in update board`);
      tile.className = `l${tileArray[y][x]}`;
      tile.classList.add("tile");
    }
  }

  document.querySelector("#moves").innerText = moveCounter; // update moveCounter
  document.querySelector("#score").innerText = score; //update score
  document.querySelector("#goal").innerText = 2 ** winningLevel; //update score
  currentGame.moves = moveCounter;
  currentGame.score = score;
  currentGame.goal = winningLevel;
  currentGame.tileArray = tileArray;
  localStorage.setItem("currentGame", JSON.stringify(currentGame));
}

function gameOverCheck() {
  // checks if any moves are possible, otherwise game over
  let possibleToMove = false;
  let moves = ["up", "down", "left", "right"];
  for (let i = 0; i < moves.length; i++) {
    if (move(moves[i], false)) possibleToMove = true;
  }
  if (possibleToMove == false) {
    banner.querySelector("#bannerText").innerText = "GAME OVER!";
    banner.style.display = "block";
    document.querySelector("#bannerScoreLabel").innerText = `Score: ${score}`;
    document.onkeydown = null;
    document.querySelector("#replay").addEventListener("click", newGame);
    setHighScore();
  }
}

function winnerCheck() {
  // check for winner by looping through tileArray
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (tileArray[i][j] >= winningLevel) {
        banner.querySelector("#bannerText").innerText = "YOU WIN!";
        banner.style.display = "block";
        document.querySelector(
          "#bannerScoreLabel"
        ).innerText = `Score: ${score}`;
        document.onkeydown = null;
        document.querySelector("#replay").addEventListener("click", newGame);
        setHighScore();
      } else continue;
    }
  }
}

function newGame() {
  //set up board based on tile selection, adds key listeners and sprawn initial tile
  document.querySelector("#replay").removeEventListener("click", newGame);
  document.onkeydown = checkKey;
  banner.style.display = "none";
  // clears the existing board
  while (board.firstChild) {
    board.removeChild(board.firstChild);
  }

  // Setting css columns to match gridSize
  board.style["grid-template-columns"] = `repeat(${gridSize}, 1fr)`;

  //Creating new div for each tile
  for (let y = 0; y < gridSize; y++) {
    let xArray = [];
    for (let i = 0; i < gridSize; i++) {
      xArray.push(0);
      tileArray[y] = xArray;
    }
    for (let x = 0; x < gridSize; x++) {
      createDiv(y, x, tileArray[y][x]);
    }
  }
  //new function getHighScore() which gets highscore from local  and updates DOM
  getHighScore();

  // sprawn initial tile
  sprawn();

  moveCounter = 0;
  score = 0;
  updateBoard();
}

function resumeGame() {
  document.onkeydown = checkKey;
  gridSize = currentGame.tileArray.length;
  winningLevel = currentGame.goal;
  score = currentGame.score;
  moveCounter = currentGame.moves;
  tileArray = currentGame.tileArray;
  board.style["grid-template-columns"] = `repeat(${gridSize}, 1fr)`;

  for (let y = 0; y < tileArray.length; y++) {
    for (let x = 0; x < tileArray.length; x++) {
      createDiv(y, x, tileArray[y][x]);
    }
  }
  getHighScore();
  updateBoard();
  winnerCheck();
}

function getHighScore() {
  let highScore = highScoreArray[winningLevel] || 0;
  document.querySelector("#highscore").innerText = highScore;
}

function setHighScore() {
  if (score > highScoreArray[winningLevel])
    highScoreArray[winningLevel] = score;
  localStorage.setItem("highScore", JSON.stringify(highScoreArray));
  getHighScore();
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

  let gridDiv = document.createElement("div");
  let gridLabel = (document.createElement("p").innerText = "Grid Size:");
  let gridSelectorDiv = document.createElement("div");
  gridSelectorDiv.style.display = "flex";
  gridSelectorDiv.className = "selectorDiv";
  for (let i = 3; i <= 8; i++) {
    let box = document.createElement("div");
    box.className = "setting-selector";
    box.classList.add("button");
    box.innerText = i;
    box.display = "inline";
    box.addEventListener("click", (event) => {
      gridSize = event.target.innerText;
      event.target.style.backgroundColor = "#c9986d";
    });
    gridSelectorDiv.append(box);
  }
  gridDiv.append(gridLabel);
  gridDiv.append(gridSelectorDiv);
  settingPage.append(gridDiv);

  let winScoreDiv = document.createElement("div");
  let winScoreLabel = (document.createElement("p").innerText =
    "Winning Score:");
  let winScoreSelectorDiv = document.createElement("div");
  winScoreSelectorDiv.style.display = "flex";
  winScoreSelectorDiv.className = "selectorDiv";
  for (let i = 6; i <= 13; i++) {
    let box = document.createElement("div");
    box.className = "setting-selector";
    box.classList.add("button");
    box.innerText = 2 ** i;
    box.display = "inline";
    box.addEventListener("click", (event) => {
      let winningScore = event.target.innerText;
      event.target.style.backgroundColor = "#c9986d";
      winningLevel = Math.log(winningScore) / Math.log(2);
    });
    winScoreSelectorDiv.append(box);
  }
  winScoreDiv.append(winScoreLabel);
  winScoreDiv.append(winScoreSelectorDiv);
  settingPage.append(winScoreDiv);

  let set = document.createElement("div");
  set.id = "setDiv";
  set.classList.add("button");
  set.innerText = "NEW GAME";
  set.addEventListener("click", () => {
    document.querySelector("#goal").innerText = 2 ** winningLevel;
    tileArray = [];
    newGame();
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

function undo() {
  if (JSON.stringify(prevTileArray) == JSON.stringify(tileArray))
    alert("Not allowed to consecutively do more than 1 undo!");
  else {
    tileArray = JSON.parse(JSON.stringify(prevTileArray));
    moveCounter++;
    score -= 500;
    updateBoard();
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
  currentGame = JSON.parse(localStorage.currentGame);
  resumeGame();
}
