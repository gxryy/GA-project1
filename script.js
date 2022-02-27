"use strict";

//----------VARIABLES----------//

let gridSize = 4;

//----------FUNCTIONS----------//

function createDiv(y, x) {
  let tile = document.createElement("div");
  tile.innerText = 0;
  tile.className = "tile";
  tile.id = `tile${y}${x}`;
  document.querySelector(".board").append(tile);
}

function checkKey(e) {
  if (e.keyCode == "38") {
    // up arrow
    console.log(`UP arrow pressed`);
  } else if (e.keyCode == "40") {
    // down arrow
    console.log(`DOWN arrow pressed`);
  } else if (e.keyCode == "37") {
    // left arrow
    console.log(`LEFT arrow pressed`);
  } else if (e.keyCode == "39") {
    // right arrow
    console.log(`RIGHT arrow pressed`);
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
