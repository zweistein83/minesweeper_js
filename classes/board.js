/** Class representing a game board for minesweeper */
class Board {
    /**
     * Create a game board
     * @param {number} rows - number of rows
     * @param {number} cols - number of columns
     * @param {number} num_mines - number of mines 
     */
    constructor(rows, cols, num_mines) {
        this.game_board = [];

        // TODO: MOVE THIS TO NEW METHOD
        // generate 2d array
        for (let row = 0; row < rows; row++) {
            this.game_board[row] = [];
            for (let col = 0; col < cols; col++) {
                this.game_board[row][col] = 0;
            }
        }

        // add mines
        this.mines = this.mine_coord_generator(num_mines, rows, cols);
        console.log(this.mines);
        let mine_row, mine_col;
        for ([mine_row, mine_col] of this.mines) {
            this.game_board[mine_row][mine_col] = mine_value;
        }

        this.populate_board(this.game_board);

    }
    /**
     * Generates a pseudo-random int between 0 and max_num
     * @param {number} max_num - max number (not inclusive)
     * @returns {number} random int
     */
    random_int(max_num) {
        return Math.floor(Math.random() * max_num);
    }

    /** 
    *   Generates an array of mine coordinates. 
    *   @param {number} num_mines - number of mine coordinates to be generated
    *   @param {number} rows - number of rows in game board
    *   @param {number} cols - number of columns in game board
    *   @returns {number[]} an array of random unique coordinates
    */
    mine_coord_generator(num_mines, rows, cols) {
        let mines = [];
        while (mines.length <= num_mines) {
            let mine_coord = [this.random_int(rows), this.random_int(cols)];
            if (!mines.includes(mine_coord)) // prevents duplicates
                mines.push(mine_coord);
        }
        return mines;
    }



    /**
     * List how many neighbouring mines for each tile. 
     * Iterates through the 2d-array. Each times it finds -1 (mine)
     * it adds 1 to each neighbour tile.
     * @param {array} game_board 
     */
    populate_board(game_board) {

        // Relative coordinates for all neighbouring tiles in clockwise direction starting at 12 o'clock.        
        const loop_modifiers = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]];

        for (let row = 0; row < game_board.length; row++) {
            for (let col = 0; col < game_board[0].length; col++) {
                if (game_board[row][col] >= 0) {
                    continue;
                }
                let d_row, d_col;
                for ([d_row, d_col] of loop_modifiers) {

                    let new_row = row + d_row;
                    let new_col = col + d_col;

                    // prevents reading from tiles outside of board.
                    if (new_row < 0 || new_row >= game_board.length ||
                        new_col < 0 || new_col >= game_board[0].length) {
                        //console.log("out of bounds: row: " + new_row + " col: " + new_col);
                        continue;
                    } else if (game_board[new_row][new_col] === mine_value) {
                        continue;
                    }
                    game_board[new_row][new_col]++
                }

            }
        }

    }
    /**
     * @returns {[number,number][]} An array containing the location of mines
     */
    get_mines() {
        return this.mines;
    }

    /**
     * @returns {number[]} An array containing the game board
     */
    get_board() {
        return this.game_board;
    }


}