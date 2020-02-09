const mine_value = -1;
const hidden_value = null;
/** Class represents a the game logic of minesweeper. 
 */
class Game {

    /** 
     * Initialize game logic
     * @param {number} rows - how many rows height
     * @param {number} cols - how many columns wide
     * @param {number} num_mines - how many mines to add
     */
    constructor(rows, cols, num_mines) {
        this.board = new Board(rows, cols, num_mines);
        
        this.game_board = this.board.get_board();
        console.table(this.game_board);
        this.visible_board = this.generate_visible_board(this.game_board.length, this.game_board[0].length);
        




        /* TODO:
            - make mouse listener as input for this
        */
        this.army_of_ants(7, 2, this.visible_board, this.game_board);
        console.table(this.visible_board);


    }
    /**
     * 
     * @param {number} rows - number of rows
     * @param {number} cols - number of columns
     * @returns {?number[]} visible board with all tiles marked as hidden
     */
    generate_visible_board(rows, cols) {
        // generate visible_board with all tiles hidden
        let board = []
        for (let row = 0; row < rows; row++) {
            board[row] = [];
            for (let col = 0; col < cols; col++) {
                board[row][col] = hidden_value;
            }
        }
        return board
    }


    /**
     * 
     * @param {number} row - selected row
     * @param {number} col -selected column
     * @param {?number[]} visible_board - 
     * @param {number[]} game_board - 
     */
    army_of_ants(row, col, visible_board, game_board) {
        let max_row = game_board.length - 1;
        let max_col = game_board[0].length - 1;


        /**
         * Recursive part
         * @param {number} row - selected row
         * @param {number} col - selected column
         */
        function ant(row, col) {
            //console.log(row, col);

            // If the tile of the visible board is not visible. Prevents running on same tile multiple times.
            if (visible_board[row][col] === hidden_value) {
                visible_board[row][col] = game_board[row][col];

                // Only show/open tiles if number of neighbouring tiles is 0
                if (visible_board[row][col] === 0) {
                    // create new ants            
                    //north
                    if (row > 0) ant(row - 1, col);

                    //south
                    if (row < max_row) ant(row + 1, col);

                    //east
                    if (col < max_col) ant(row, col + 1);

                    //west
                    if (col > 0) ant(row, col - 1);

                    // diagonals
                    //north-east
                    if (row > 0 && col < max_col) ant(row - 1, col + 1);

                    //north-west
                    if (row > 0 && col > 0) ant(row - 1, col - 1);

                    //south-east
                    if (row < max_row && col < max_col) ant(row + 1, col + 1);

                    //south-west
                    if (row < max_row && col > 0) ant(row + 1, col - 1);


                }
            }
        }

        ant(row, col);


    }

}

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
        while (mines.length < num_mines) {
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

    get_mines(){
        return this.mines;
    }

    /**
     * @returns {number[]} An array containing the game board
     */
    get_board() {
        return this.game_board;
    }


}

//var board = new Board(20, 20, 100);

//console.table(board.get_board());
//console.log(board.get_board());

var test = new Game(20,20,40);

