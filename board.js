class Board {
    colorFood = "hsl(200 80% 60%)";
    #grid;
    constructor() {
        this.grid = [];
        this.foodPos = {x:-1, y:-1};
        // init empty field
        for(let i = 0; i < dim.w; i++) {
            this.grid[i] = [];
            for(let j = 0; j < dim.h; j++) {
                this.grid[i][j] = 0;
            }
        }
    }
    
    redraw() {
        ctx.clear();
        for(let i = 0; i < dim.w; i++) {
            for(let j = 0; j < dim.h; j++) {
                this.drawGrid(i, j);
            }
        }
    }
    
    spawnFood() {
        while (true){
            let x = Math.floor(Math.random()*dim.w);
            let y = Math.floor(Math.random()*dim.h);
            if(this.getPixel(x,y) === 0) {
                this.grid[x][y] = 1;
                this.foodPos = {x: x, y:y};
                this.drawGrid(x,y);
                break;
            }
        }
    }
    getFoodPos() {
        return this.foodPos;
    }
    
    getPixel(x,y) {
        return this.grid[x][y];
    }
    
    drawGrid(x, y) {
        let pixel = this.getPixel(x,y);
        if(pixel === 0) {
            ctx.clearRect(x*gridSize.w, y*gridSize.h, gridSize.w, gridSize.h);
            // this.#draw(x, y, this.colorBG);
            return;
        }
        if(pixel === 1) {
            this.#drawFood(x,y);
            // this.#draw(x,y,this.colorFood);
            return;
        }
        if(this.isSnake(pixel)) {
            this.#drawSnake(x,y,pixel.color);
        }
    }
    
    isSnake(pixel) {
        return typeof(pixel) === "object" && pixel.isSnake;
    }
    
    #drawFood(x,y) {
        ctx.fillStyle = this.colorFood;
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.beginPath();
        let radius = Math.min(gridSize.w, gridSize.h) / 2;
        ctx.ellipse(x*gridSize.w + radius, y*gridSize.h + radius, radius-2, radius-2, 0, 0, 2*Math.PI);
        ctx.fill();
        ctx.stroke();
    }
    
    #drawSnake(x, y, color) {
        ctx.fillStyle = color;
        ctx.strokeStyle = "hsl(0 0 0 / 50%)";
        ctx.lineWidth = 1;
        ctx.fillRect(x*gridSize.w, y*gridSize.h, gridSize.w, gridSize.h);
        ctx.strokeRect(x*gridSize.w+1, y*gridSize.h+1, gridSize.w-2, gridSize.h-2);
    }
    
    setSnake(x,y, snake) {
        this.grid[x][y] = snake;
        this.drawGrid(x,y);
    }
    unsetSnake(x,y) {
        this.grid[x][y] = 0;
        this.drawGrid(x,y);
    }
}
