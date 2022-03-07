# 2048 Game

## _Just another 2048 game_

This 2048 game is a remake of the original 2048 game found at https://play2048.co

## Features

- 3 main game modes, classic, time attack and duo
- 4 way direction control with arrow keys
- undo functionality
- local storage of game board and highscore for realtime progress save
- ability to select grid size and winning goal
- time attack mode only allows for 60 seconds of gametime before the highscore is saved
- Duo game mode allows for 2 player simultaneous game play on independent boards with arrow keys amd WASD keys respectively

## Game mode and its dependencies

- Classic
  -- index.html
  -- game.js
  -- style.css
- Time Attack
  -- time.html
  --time.js
  style.css
- Duo
  -- dual.html
  -- dual.js
  -- dual.css

## Functions

- newGame() - initialises a new game with selected or default parameters
- createDiv(y,x) - creates a new div in DOM given the x and y coordinates.
- move(dir, playerMove) - move handling given the direction and a boolean if its a player move. calls on function gravity and checkMerge for each respective row/column
- sprawn() - spawns a tile at ramdom with DOM manipulation after checkEmptyTile()
- checkEmptyTile() looks through tileArray and returns coordinates of empty tiles.
- checkKey(event) - handler to execute key events when keys are pressed. calls the move function with respective direction
- checkMerge(array) - checks if 2 adjacent elemenents int he input array are the same, if same, it merges into the first element by increasing the level of first element and setting the second element to 0.
- gravity(array) - removes and pops the 0 value element in the input array.
- updateBord() - function to update the game board by redrawing the board each time its invoked.
- gameOverCheck() - checks if game is over by check for any possible moves, calling the move function with playermove to false.
- winnerCheck() - checks if the current highest tile meets the winningLevel.
- toggleSettings() - DOM manipulation for the settings page
- removeSettingsPage() - DOM manipulation for the settings page
- resumeGame() - read game from local storage and restore progress
- getHighScore() - get highscore from local storage
- undo() - undo functionality that restores the grid to previous array and calls the updateBoard function
- showDirection(dir) - activates CSS reflow for animation
- startTimer() - function to start the timer
- updateTimer() - function to remove 1s from timer every 1000ms
