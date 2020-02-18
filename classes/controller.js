class Controller {
    /** Creates a controller    
     * @param {Game} game 
     * @param {Html_GUI} gui 
     */
    constructor(game, gui) {
        gui.update_board(game.visible_board);
        this.open_tile_listener(game, gui);
        this.mark_mine_listener(game, gui);        
        this.game_started = false;


    }

    create_timer() {
        const start_time = Date.now();
        window.clearInterval(interval_ref);
        interval_ref = window.setInterval(() => {
            let time_now = Date.now();
            console.log("tick")
            let elapsed_seconds = Math.floor((time_now - start_time) / 1000);
            console.log(elapsed_seconds);

        }, 1000);
    }

    first_tile_opened(){
        if(!this.game_started){
            this.game_started = true;
            this.create_timer();            
        }
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
                this.first_tile_opened();
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
