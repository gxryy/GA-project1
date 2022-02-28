"use strict";

//----------VARIABLES----------//

let gridSize = 4;
let tileArray = []; // 2D array to reflect the value of each tile
let winningLevel = 11; //  11-2048   10-1024   9-512   8-256   7-128   6-64
const banner = document.querySelector("#banner");

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
  move(dir, true);
}

function checkMerge(array) {
  for (let i = 0; i < array.length; i++) {
    if (array[i] !== 0) {
      if (array[i] === array[i + 1]) {
        array[i]++;
        array[i + 1] = 0;
      }
    }
  }
  return array;
}

function gravity(array) {
  for (let i = array.length; i >= 0; i--) {
    if (array[i] === 0) {
      array.splice(i, 1);
      array.push(0);
    }
  }
  return array;
}

function move(dir, playerMove) {
  let hasMove = false;
  if (dir === "up" || dir === "down") {
    for (let i = 0; i < gridSize; i++) {
      //loop through adjacent directions
      let directionArray = [];
      for (let j = 0; j < gridSize; j++) {
        directionArray.push(tileArray[j][i]);
      }
      if (dir === "down") directionArray.reverse();

      directionArray = gravity(directionArray);
      directionArray = checkMerge(directionArray);
      directionArray = gravity(directionArray);
      if (dir === "down") directionArray.reverse();
      for (let j = 0; j < gridSize; j++) {
        if (tileArray[j][i] != directionArray[j]) hasMove = true;
        tileArray[j][i] = directionArray[j];
      }
    }
  } else if (dir === "left" || dir === "right") {
    for (let i = 0; i < gridSize; i++) {
      //loop through adjacent directions
      let directionArray = [];
      for (let j = 0; j < gridSize; j++) {
        directionArray.push(tileArray[i][j]);
      }
      if (dir === "right") directionArray.reverse();

      directionArray = gravity(directionArray);
      directionArray = checkMerge(directionArray);
      directionArray = gravity(directionArray);
      if (dir === "right") directionArray.reverse();
      for (let j = 0; j < gridSize; j++) {
        if (tileArray[i][j] != directionArray[j]) hasMove = true;
        tileArray[i][j] = directionArray[j];
      }
    }
  }
  if (playerMove) {
    if (hasMove) {
      sprawn();
      winnerCheck();
    } else if (checkEmptyTile().length === 0) gameOverCheck();
  } else {
    return hasMove;
  }
}

function checkEmptyTile() {
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
  //   if (emptyTileArray.length === 0) gameOverCheck();
  let randomIndex = Math.floor(Math.random() * emptyTileArray.length);
  let sprawnTile = emptyTileArray[randomIndex];
  tileArray[sprawnTile[0]][sprawnTile[1]]++;
  updateBoard();
}

function updateBoard() {
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
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (tileArray[i][j] >= winningLevel) {
        banner.querySelector("#bannerText").innerText = "WINNER";
        banner.style.display = "block";
      } else continue;
    }
  }
}

//----------MAIN----------//

// Setting css columns to match gridSize
document.querySelector(".board").style[
  "grid-template-columns"
] = `repeat(${gridSize}, 1fr)`;

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
