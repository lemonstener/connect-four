const WIDTH = 7;
const HEIGHT = 6;


// Instead of using player 1/2 I have opted for a simpler 'red'/'blue' version instead. That makes it easier to understand and doesn't require 
// as much writing down the line. 

const players = {
  playerOne: 'red',
  playerTwo: 'blue'
}
let currPlayer = players.playerOne;
const board = [];


function makeBoard() {
  for (let y = 0; y < HEIGHT; y++) {
    const row = [];
    for (let x = 0; x < WIDTH; x++) {
      row.push(null);
    }
    board.push(row);
  }
}



function makeHtmlBoard() {
  const htmlBoard = document.getElementById('board');

  // Creating the top row for the table and giving it the id of 'column-top' in order to visually separate it from the rest of the board. This will be
  // the main play area for the game. When you click on it, function 'handleClick' will trigger. 


  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  // Using a simple loop we create an amount of table cells equal to the 'WIDTH' property. Each cell will possess a unique id for gameplay purposes.


  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    // Appending each cell to the 'top' row
    top.append(headCell);
  }
  // Appending the 'top' row to the game board.
  htmlBoard.append(top);


  // Using a simple nested loop we create the rest of the board. 


  for (let y = 0; y < HEIGHT; y++) {
    // Looping over the HEIGHT property. Each time we create a new table row.
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      // Looping over the WIDTH property. Each time we create a new table cell and give it a unique id based off what 'x' and 'y' are currently.
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      // Appending cell to the current roll.
      row.append(cell);
    }
    // Appending table row to the table element.
    htmlBoard.append(row);
  }
}


// Finding an empty spot on the gameboard to be filled when clicked. Using a nested loop over the 'board' array we are searching for the first
// 'null' value. When found we change the appropriate spot in the 'board' array to equal the the 'currPlayer' value. 

// Then, we are calling 'placeInTable()' with the parameters we just got from this function ('y' and 'x' respectively).


function findSpotForCol(x) {
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (board[y][x] === null) {
      board[y][x] = currPlayer;
      placeInTable(y, x)
      break;
    }
  }
  // If all the spots in the column are filled (!== null) we simply return and nothing else happens. The player must then choose a new column.
  return;
}


// Function 'switchPlayer()' simply swaps the value of 'currPlayer' (red <-> blue <-> red) and is triggered each time a spot in the gameboard is filled.

function switchPlayer() {
  currPlayer === players.playerOne ? currPlayer = players.playerTwo : currPlayer = players.playerOne;
}


// Function 'placeInTable()' uses the 'y' and 'x' values generated from 'findSpotForCol()' as parameters.
// We create a new div then give it 2 classes - 'piece' in order to get a circle and either 'red' or 'blue' based off of the 'board' array.

// Because I decided to name players 'red'/'blue' that class value is simply pulled from the 'board' array.
// If I had instead gone with the 1/2 scheme I would've had to write more conditional logic to determine which class to style the piece with.
// A simple workaround would've been to just name the styling classes '.1' and '.2' but that's bad practice in CSS.

function placeInTable(y, x) {
  const piece = document.createElement('div');
  piece.classList.add('piece', board[y][x]);


  // Appending the piece to the appropriate table cell. The cell's id matches what's in the 'board' array.
  const cell = document.getElementById(`${y}-${x}`);
  cell.append(piece);
}


// 'endGame()' shows an alert with a msg generated from 'handleClick()' and then resets the board for a new game.

function endGame(msg) {
  alert(msg);
  for (let y = 0; y <= HEIGHT; y++) {
    document.querySelector('tr').remove();
    board.pop();
  }
  makeBoard();
  makeHtmlBoard();
  currPlayer = players.playerOne;
}



// Function 'handleClick()' triggers when we click on the top row of the gameboard.

function handleClick(evt) {
  // First we pinpoint exactly where the click happened, then we store the value from the target's id (0-6).
  const x = +evt.target.id;
  // We run 'findSpotForCol()' with the stored target id value as parameter.
  findSpotForCol(x);


  // We run the 'checkForWin()' function each time a spot in the gameboard is filled. 
  if (checkForWin()) return endGame(`${currPlayer.toUpperCase()} player won!`);




  // If there is no winner we then check for a tie
  if (checkForTie()) return endGame('Draw');




  // If neither thing happens we just switch players and the game continues.
  switchPlayer();
}


// Function 'checkForTie()' loops over the 'board' array each time it's called. If it cannot find 'null' anywhere it returns 'true'.

function checkForTie() {
  for (let row of board) {
    if (row.includes(null)) {
      return;
    }
  }
  return true;
}


/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
