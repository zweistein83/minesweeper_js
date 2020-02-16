const mine_value = -1;
const hidden_value = null;
const marked_value = 10;
const wrong_marked_value = 11;
var difficulty = "medium";




/** Class represents a the game logic of minesweeper.  
 * @todo implement middle click (click on number to open neighbouring tiles if mine markers === number) Loop through neighbours check for mine. If not mine open neighbours.
 * @todo implement game over state.
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
        this.board = new Board(rows, cols, num_mines);
        this.mines = this.board.get_mines();
        this.game_board = this.board.get_board();
        this.game_state = "alive";
        //console.table(this.game_board);
        this.visible_board = this.generate_visible_board(this.game_board.length, this.game_board[0].length);

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
        }



        this.army_of_ants(row, col, this.visible_board, this.game_board);
        //console.table(this.visible_board);
    }

    /** Toggles marked value and hidden value on a tile.
     *  Used to add flags for user to mark a potential mine.
     * 
     * @param {number} row 
     * @param {number} col 
     */
    mark_mine(row, col) {
        if (this.visible_board[row][col] === null) {
            this.visible_board[row][col] = marked_value;
        }
        else if (this.visible_board[row][col] === marked_value) {
            this.visible_board[row][col] = hidden_value;
        }

    }

    /**
     * Triggered if clicking on a mine.
     * Show all mines and hidden tiles.
     * Show wrongly placed markers.
     */
    game_over() {
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

/** Class for rendering the game in html 
 */
class Html_GUI {
    /** Create a Html_GUI object
     * 
     * @param {number} rows - Number of rows
     * @param {number} cols - Number of columns
     */
    constructor(rows, cols) {
        this.clear_board(); // clears the game_container element.
        this.draw_ui();
        this.table = this.draw_board(rows, cols);
        this.rows = rows;
        this.cols = cols;

    }

    draw_ui() {
        const button = (btn_txt, action) => {
            let btn = document.createElement("button");
            btn.setAttribute("class", "ui_btn");
            btn.innerText = btn_txt;
            btn.setAttribute("onclick", action);
            btn.setAttribute("value", btn_txt);
            return btn;
        }

        const select_list = () => {
            let select_el = document.createElement("select");
            select_el.id = "game_difficulty";
            //select_el.setAttribute("value", "medium");
            select_el.setAttribute("onchange", "set_difficulty();");
            select_el.setAttribute("onfocus", "this.selectedIndex = -1;");

            const add_option = (value) => {
                let elem = document.createElement("option");
                elem.setAttribute("value", value);
                if (difficulty === value){
                    elem.setAttribute("selected","selected");
                }
                elem.id = "d_" + value;
                elem.innerText = value;
                select_el.appendChild(elem);
            }
            add_option("easy");
            add_option("medium");
            add_option("hard");

            return select_el;

        }

        let ui_element = document.createElement("div");
        //ui_element.innerText = "Test";
        ui_element.setAttribute("class", "game_header");
        // ui_element.appendChild(button("test", 'start_game(10,10,10);'));
        ui_element.appendChild(select_list());

        let game_container = document.getElementById("game_container");
        game_container.appendChild(ui_element);

    }

    /** Renders a game-board in html.
     * 
     * @param {number} rows - Number of rows
     * @param {number} cols - Number of columns
     */
    draw_board(rows, cols) {
        let table = document.createElement("table");
        table.setAttribute("class", "game_board");

        for (let row = 0; row < rows; row++) {
            let table_row = document.createElement("tr");
            for (let col = 0; col < cols; col++) {
                let table_col = document.createElement("td");
                table_col.id = row + "_" + col;
                table_col.innerText = "";
                table_row.appendChild(table_col);
            }
            table.appendChild(table_row);
        }

        let game_container = document.getElementById("game_container");
        game_container.appendChild(table);
        //document.body.appendChild()

        return table;
    }

    /** Updates the html board.
     * 
     * @param {number[]]} visible_board 
     */
    update_board(visible_board) {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const current_tile = document.getElementById(row + "_" + col);
                const mines_count = visible_board[row][col];
                current_tile.innerText = mines_count;
                current_tile.removeAttribute("class");
                current_tile.setAttribute("class",
                    this.number_classes(mines_count));
            }
        }

    }

    /** Returns the css-class for a given number of mines.
     *  
     * @param {number} num - number of neighbouring mines
     * @returns {string} css_class
     */
    number_classes(num) {
        if (num === marked_value) {
            return ("mine_marker");
        }

        if (num === wrong_marked_value) {
            return ("wrong_mine_marker");
        }

        if (num === mine_value) {
            return "mine";
        }
        if (num === null) {
            return "not_opened_tile"
        }
        const classes = ["mines_0", "mines_1", "mines_2", "mines_3", "mines_4", "mines_5", "mines_6", "mines_7", "mines_8"];
        return classes[num] + " " + "opened_tile";
    }

    /**
     * Clears table.
     */
    clear_board() {
        let game_container = document.getElementById("game_container");
        while (game_container.firstChild) {
            game_container.removeChild(game_container.firstChild);
        }

    }

    draw_info() {

    }

    /**
     * @returns {element} html DOM table
     */
    get_table() {
        return this.table;
    }


}

class Controller {
    /** Creates a controller    
     * @param {Game} game 
     * @param {Html_GUI} gui 
     */
    constructor(game, gui) {
        gui.update_board(game.visible_board);
        this.open_tile_listener(game, gui);
        this.mark_mine_listener(game, gui);


    }

    /** Converts a string of type "row_column"
     *  to array with [row, column].
     * @param {event} evt 
     * @returns {number[]} row and column
     */
    get_position_from_evt(evt) {
        const selected_id = evt.target.id;

        const tmp_rowcol = selected_id.split("_");
        let row, col;
        [row, col] = tmp_rowcol.map((i) => parseInt(i));
        return [row, col];

    }

    /**
     * Creates event-listener for mouseclick.
     * Calls Game-object to open a tile
     * Calls Html_GUI-object to update the visible board.
     * @param {Game} game - Game object
     * @param {Html_GUI} gui - Html_GUI object
     */
    open_tile_listener(game, gui) {
        const table = gui.get_table();
        table.addEventListener("click", (evt) => {
            console.log(evt.target.id);
            /* const selected_id = evt.target.id;
            if (selected_id) {
                const tmp_rowcol = selected_id.split("_"); */
            const selected_id = evt.target.id;
            if (selected_id) {
                let row, col;
                //[row, col] = tmp_rowcol.map((i) => parseInt(i));
                [row, col] = this.get_position_from_evt(evt);
                if (game.get_game_state() === "game_over") {
                    return;
                }
                console.log("row: " + row + " col: " + col);
                game.open_tile(row, col);
                gui.update_board(game.visible_board);
            }

        });
    }
    /** Creates an eventListener for right click.
     * Toggles marking the position with a flag and removing flag.
     * 
     * @param {Game} game 
     * @param {Html_GUI} gui 
     */
    mark_mine_listener(game, gui) {
        const table = gui.get_table();
        table.addEventListener("contextmenu", (evt) => {
            evt.preventDefault();

            const selected_id = evt.target.id;
            if (selected_id) {
                let row, col;
                [row, col] = this.get_position_from_evt(evt);
                console.log("mark mine row: " + row + " col: " + col);
                game.mark_mine(row, col);
                gui.update_board(game.visible_board);
            }
        });

    }


}



/** Starts a game.
 * 
 * @param {number} rows 
 * @param {number} cols 
 * @param {number} num_mines 
 */
function start_game() {
    const easy = [15, 15, 30];
    const medium = [20, 20, 100];
    const hard = [25, 20, 200];
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

    /*
    if (difficulty === "easy") {
        start_game(15, 15, 30);
    }
    else if (difficulty === "medium") {
        start_game(20, 20, 100);
    }
    else {
        start_game(25, 20, 200);
    }
    */
}


start_game();

//var board = new Board(20, 20, 100);

//console.table(board.get_board());
//console.log(board.get_board());



