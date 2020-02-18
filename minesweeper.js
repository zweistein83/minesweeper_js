const mine_value = -1;
const hidden_value = null;
const marked_value = 10;
const wrong_marked_value = 11;
var difficulty = "medium";
var interval_ref = null;











/** Starts a game.
 * 
 * @param {number} rows 
 * @param {number} cols 
 * @param {number} num_mines 
 */
function start_game() {
    const easy = [10, 10, 10];
    const medium = [15, 13, 40];
    const hard = [30, 16, 99];
    let rows, cols, num_mines;

    if (difficulty === "easy") {
        [rows, cols, num_mines] = easy;
    }
    else if (difficulty === "medium") {
        [rows, cols, num_mines] = medium;
    }
    else if (difficulty === "hard") {
        [rows, cols, num_mines] = hard;
    }


    let game = new Game(rows, cols, num_mines);
    let gui = new Html_GUI(rows, cols);
    let controller = new Controller(game, gui);
}



function set_difficulty() {
    difficulty = document.getElementById("game_difficulty").value;
    start_game();
}


start_game();

//var board = new Board(20, 20, 100);

//console.table(board.get_board());
//console.log(board.get_board());



