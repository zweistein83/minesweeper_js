/** Class represents a the game logic of minesweeper.  
 * @todo implement middle click (click on number to open neighbouring tiles if mine markers === number) Loop through neighbours check for mine. If not mine open neighbours.
 * @todo implement new game
 * @todo implement different difficulties 
 * @todo change input to difficulty? or leave possibility for custom? 
 */
class Game {

    /** 
     * Initialize game logic
     * @param {number} rows - how many rows height
     * @param {number} cols - how many columns wide
     * @param {number} num_mines - how many mines to add
     */
    constructor(rows, cols, num_mines) {
        this.mine_counter = num_mines;
        this.board = new Board(rows, cols, num_mines);
        this.mines = this.board.get_mines();
        this.game_board = this.board.get_board();
        this.game_state = "alive";
        //console.table(this.game_board);
        this.visible_board = this.generate_visible_board(this.game_board.length, this.game_board[0].length);

    }

    stop_timer(){
        window.clearInterval(interval_ref);
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
     * @param {*} row - selected row
     * @param {*} col - selected column
     */
    open_tile(row, col) {
        /*
        if (this.game_state === "game_over"){
            return;
        }
        */
        const tile_value = this.game_board[row][col];
        if (this.visible_board[row][col] === marked_value) {
            console.log("MARKED");
            return;
        }
        else if (tile_value === -1) {
            this.game_over();
            return;
        }



        this.army_of_ants(row, col, this.visible_board, this.game_board);


        if (this.are_all_tiles_open()) {
            this.game_won();

        };
        //console.table(this.visible_board);
    }

    /** Toggles marked value and hidden value on a tile.
     *  Used to add flags for user to mark a potential mine.
     * 
     * @param {number} row 
     * @param {number} col 
     */
    mark_mine(row, col) {
        if (this.game_state !== "alive") {
            return;
        }
        if (this.visible_board[row][col] === null) {
            this.visible_board[row][col] = marked_value;
            this.mine_counter--;
            console.log(this.mine_counter);
        }
        else if (this.visible_board[row][col] === marked_value) {
            this.visible_board[row][col] = hidden_value;
            this.mine_counter++;
            console.log(this.mine_counter);
        }

    }

    /** Checks if all tiles exept for mines are opened
     * @returns {boolean} all tiles are open
     */
    are_all_tiles_open() {
        for (let row = 0; row < this.game_board.length; row++) {
            for (let col = 0; col < this.game_board[0].length; col++) {
                let visible_board_tile = this.visible_board[row][col];
                let game_board_tile = this.game_board[row][col];

                if (game_board_tile !== visible_board_tile) {
                    if (game_board_tile === mine_value) {
                        continue;
                    }
                    else {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    /**
     * Triggered if all tiles are opened except for mines.
     */
    game_won() {
        if (this.game_state !== "alive") {
            return;
        }

        for (let row = 0; row < this.visible_board.length; row++) {
            for (let col = 0; col < this.visible_board[0].length; col++) {
                if (this.game_board[row][col] === mine_value) {
                    if (this.visible_board[row][col] === marked_value) {
                        continue; // flagged correctly. Flag stays.
                    }
                    else {
                        this.visible_board[row][col] = marked_value;
                    }
                }
                else {
                    this.visible_board[row][col] = this.game_board[row][col];
                }

            }
        }        
        this.mine_counter = 0;
        this.stop_timer();
        this.game_state = "won";
        alert("You won!");
    }

    /**
     * Triggered if clicking on a mine.
     * Show all mines and hidden tiles.
     * Show wrongly placed markers.
     */
    game_over() {
        if (this.game_state !== "alive") {
            return;
        }
        console.log("game_over");
        this.game_state = "game_over";
        //this.visible_board = this.game_board;

        for (let row = 0; row < this.visible_board.length; row++) {
            for (let col = 0; col < this.visible_board[0].length; col++) {

                if (this.visible_board[row][col] === marked_value) {
                    if (this.game_board[row][col] === mine_value) {
                        continue; // flagged correctly. Flag stays.
                    }
                    else {
                        this.visible_board[row][col] = wrong_marked_value;
                        continue;
                    }

                }
                this.visible_board[row][col] = this.game_board[row][col];

            }
        }
        this.stop_timer();
        alert("Game over!");
    }

    /**
     * @returns {string} Game state
     */
    get_game_state() {
        return this.game_state;
    }


    /** Iterates outward in all directions from a given
     *  row and column recursively. Transfers values from game_board
     *  to visible_board until a number higher than zero is found.
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
         * @todo maybe optimize code. Prevent backtrack. (~12,5% performance increase?)
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

    get_mine_counter(){
        return this.mine_counter;
    }

}