"use strict";

//----------VARIABLES----------//

let gridSize = 4;
let tileArray = []; // 2D array to reflect the value of each tile
let winningLevel = 11; //  11-2048   10-1024   9-512   8-256   7-128   6-64
let moveCounter = 0; //move counter
let score = 0; // score counter
const banner = document.querySelector("#banner"); //banner is used to display winner or game over message

//----------FUNCTIONS----------//

function createDiv(y, x) {
  // Create .tile divisions with id tile coordinates and append to .board
  let tile = document.createElement("div");
  tile.innerText = 0;
  tile.className = "tile";
  tile.id = `tile${y}${x}`;
  let xArray = [];
  for (let i = 0; i < gridSize; i++) xArray.push(0);
  tileArray[y] = xArray;
  document.querySelector(".board").append(tile);
}

function checkKey(e) {
  // check the keyvalue of event and call move function
  let dir = "";
  if (e.keyCode == "38") {
    // up arrow
    dir = "up";
  } else if (e.keyCode == "40") {
    // down arrow
    dir = "down";
  } else if (e.keyCode == "37") {
    // left arrow
    dir = "left";
  } else if (e.keyCode == "39") {
    // right arrow
    dir = "right";
  }
  move(dir, true); // calls move function with the respective direction. 2nd arg = true as it is from a keyboard event
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

function move(dir, playerMove) {
  // this function takes the input of the move and check if it is a player move or computer move
  let hasMove = false; // hasMove is to determine if there is a change in tile positions after the move.

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
        tileArray[j][i] = directionArray[j]; // updating tileArray with new merged and gravitied column array (updown)
      } else if (dir === "left" || dir === "right") {
        if (tileArray[i][j] != directionArray[j]) hasMove = true;
        tileArray[i][j] = directionArray[j]; // similar, leftright
      }
    }
  }

  if (playerMove) {
    // if its a player move
    if (hasMove) {
      // and move is valid
      moveCounter++; // increse move counter
      sprawn(); // sprawn a new tile
      winnerCheck(); // check if there are any winning tiles
    } else if (checkEmptyTile().length === 0) gameOverCheck(); //if there are no empty tiles, execute gameOverCheck
  } else {
    // if its a computer move
    return hasMove; // return if there is move or not
  }
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
      if (tileArray[y][x] != 0)
        document.querySelector(`#tile${y}${x}`).innerText =
          2 ** tileArray[y][x];
      else if (tileArray[y][x] == 0)
        document.querySelector(`#tile${y}${x}`).innerText = "";
      else console.log(`error in update board`);
    }
  }
  document.querySelector("#moves").innerText = moveCounter; // update moveCounter
  document.querySelector("#score").innerText = score; //update score
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
  }
}

function winnerCheck() {
  // check for winner by looping through tileArray
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (tileArray[i][j] >= winningLevel) {
        banner.querySelector("#bannerText").innerText = "WINNER";
        banner.style.display = "block";
      } else continue;
    }
  }
}

function setUpBoard() {
  //set up board based on tile selection, adds key listeners and sprawn initial tile
  let board = document.querySelector(".board");
  // clears the existing board
  while (board.firstChild) {
    board.removeChild(board.firstChild);
  }

  // Setting css columns to match gridSize
  board.style["grid-template-columns"] = `repeat(${gridSize}, 1fr)`;

  //Creating new div for each tile
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      createDiv(y, x);
    }
  }

  // Add event listeners for keyboard events
  document.onkeydown = checkKey;
  // sprawn initial tile
  sprawn();
}

function toggleSettings() {
  // display and remove the settings panel. sets the respective settings
  // changing existing listener to close panel instead
  settings.removeEventListener("click", toggleSettings);
  settings.addEventListener("click", removeSettingsPage);
  // new setting div with id settingpage
  let settingPage = document.createElement("div");
  settingPage.id = "settingpage";

  let gridDiv = document.createElement("div");
  let gridLabel = (document.createElement("p").innerText = "Grid Size:");
  let gridSelectorDiv = document.createElement("div");
  gridSelectorDiv.style.display = "flex";
  gridSelectorDiv.className = "selectorDiv";
  for (let i = 3; i <= 8; i++) {
    let box = document.createElement("div");
    box.className = "setting-selector";
    box.innerText = i;
    box.display = "inline";
    box.addEventListener("click", (event) => {
      gridSize = event.target.innerText;
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
    box.innerText = 2 ** i;
    box.display = "inline";
    box.addEventListener("click", (event) => {
      let winningScore = event.target.innerText;
      winningLevel = Math.log(winningScore) / Math.log(2);
    });
    winScoreSelectorDiv.append(box);
  }
  winScoreDiv.append(winScoreLabel);
  winScoreDiv.append(winScoreSelectorDiv);
  settingPage.append(winScoreDiv);

  let set = document.createElement("div");
  set.id = "setDiv";
  set.innerText = "SET";
  set.addEventListener("click", () => {
    document.querySelector("#goal").innerText = 2 ** winningLevel;
    setUpBoard();
  });
  settingPage.append(set);
  document.querySelector("#statusbar").append(settingPage);
}

function removeSettingsPage() {
  settings.removeEventListener("click", removeSettingsPage);
  document.querySelector("#settingpage").remove();
  settings.addEventListener("click", toggleSettings);
}
//----------MAIN----------//

// add handling for settings
const statusBar = document.querySelector("#statusbar");
const settings = document.querySelector("#settings");
settings.addEventListener("click", toggleSettings);

setUpBoard();
