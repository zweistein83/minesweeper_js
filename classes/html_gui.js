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

        const text_field = (txt, label)=>{
            let text_el = document.createElement("div");
            
            let dynamic_text = document.createElement("div");
            text_el.innerText= label;
            dynamic_text.id = txt;
            dynamic_text.innerText = "0";
            text_el.setAttribute("class", txt);
            text_el.appendChild(dynamic_text);
            return text_el;
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
                if (difficulty === value) {
                    elem.setAttribute("selected", "selected");
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
        let ui_container = document.createElement("div");
        ui_container.setAttribute("class", "ui_container");
        let ui_element = document.createElement("div");
        //ui_element.innerText = "Test";
        ui_element.setAttribute("class", "game_header");
        // ui_element.appendChild(button("test", 'start_game(10,10,10);'));
        ui_element.appendChild(select_list());
        ui_element.appendChild(button("Restart", "start_game();"));
        ui_element.appendChild(text_field("mine_counter_field", "Mines:"));
        ui_element.appendChild(text_field("timer_field", "Time:"));


        ui_container.appendChild(ui_element);
        let game_container = document.getElementById("game_container");
        game_container.appendChild(ui_container);

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