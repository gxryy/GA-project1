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

  //   console.log(`div to be created for y:${y} and x:${x}`);
}

//----------MAIN----------//

// setting css columns to match gridSize
document.querySelector(".board").style[
  "grid-template-columns"
] = `repeat(${gridSize}, 1fr)`;

//Creating new div for each tile
for (let y = 0; y < gridSize; y++) {
  for (let x = 0; x < gridSize; x++) {
    createDiv(y, x);
  }
}
