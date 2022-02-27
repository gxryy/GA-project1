"use strict";

//----------VARIABLES----------//

let gridSize = 4;
let tileArray = []; // 2D array to reflect the value of each tile

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

  move(dir);
}

function move(dir) {
  console.log(`Direction ${dir}`);
}

function sprawn() {
  // select empty tiles and increase the value of 1 tile at random. updates tileArray and calls updateBoard function
  let emptyTileArray = [];
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      if (tileArray[y][x] === 0) {
        emptyTileArray.push([y, x]);
      }
    }
  }
  let randomIndex = Math.floor(Math.random() * emptyTileArray.length);
  let sprawnTile = emptyTileArray[randomIndex];
  tileArray[sprawnTile[0]][sprawnTile[1]]++;
  updateBoard();
}

function updateBoard() {
  console.log(`Board graphics will be updated`);
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      if (tileArray[y][x] != 0)
        document.querySelector(`#tile${y}${x}`).innerText =
          2 ** tileArray[y][x];
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
console.table(tileArray);
