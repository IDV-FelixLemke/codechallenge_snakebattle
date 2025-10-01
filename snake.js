var dirs = ["U","R","D","L"];

class Snake {
    #body;
    #headPos;
    #dir;
    #length;
    #maxHealth;
    #stepCount;
    #hungerIn;
    #alreadyTurned;
    constructor(game, data, startPos) {
        this.isSnake = true;
        this.alive = true;
        this.color = data.color;
        this.game = game;
        this.#body = [startPos];
        this.#headPos = startPos;
        this.#drawHead();
        this.#dir = dirs[Math.floor(Math.random()*dirs.length)];
        this.#length = 20;
        this.moveFuncion = data.moveFunction;
        this.team = data.team;
        this.#maxHealth = dim.w*dim.h / 5; // scaling with grid size
        this.#stepCount = 0;
        this.#hungerIn = this.#maxHealth; 
        this.#alreadyTurned = false;
    }
    
    getPos() {
        return this.#headPos;
    }
    
    getScore() {
        return this.#length;
    }
    getMaxHealth() {
        return this.#maxHealth;
    }
    
    getStepCount() {
        return this.#stepCount;
    }
    getHealth() {
        return Math.round(this.#hungerIn/(this.#maxHealth)*100)
    }
    getDir() {
        return this.#dir;
    }
    
    #drawHead() {
        this.game.board.setSnake(this.#headPos.x, this.#headPos.y, this);
    }
    
    turn(turn) {
        if(this.#alreadyTurned) {
            console.warn("Turn got called more then once");
            return;
        }
        this.#dir = this.turnDir(turn);
        this.#alreadyTurned = true;
    }
    
    turnDir(turn) {
        if(turn === "S") return this.getDir();
        let inc = 1;
        if(turn === "L") inc = -1;
        let dirIdx = dirs.findIndex(dir => dir === this.#dir);
        dirIdx += dirs.length + inc;
        return dirs[dirIdx % dirs.length];
    }
    
    nextPosInDir(dir = this.#dir) {
        let newPos = {x: this.#headPos.x, y: this.#headPos.y};
        switch(dir) {
            case "U":
                newPos.y -= 1;
                break;
            case "R":
                newPos.x += 1;
                break;
            case "D":
                newPos.y += 1;
                break;
            case "L":
                newPos.x -= 1;
                break;
        }
        return newPos;
    }
    
    eat() {
        this.#hungerIn = this.#maxHealth;
        this.#length += 5;
    }
    
    step() {
        this.#alreadyTurned = false;
        this.moveFuncion(this);
        let newPos = this.nextPosInDir();
        // check for collision
        if(this.checkCollision(newPos)) {
            return false;
        }
        // check for hunger
        this.#hungerIn -= 1;
        if(this.#hungerIn <= 0) {
            return false; //starvation
        }
        this.#stepCount++;
        this.#headPos = newPos;
        this.#body.push(newPos);
        if(this.#body.length > this.#length) {
            let firstPos = this.#body.shift();
            this.game.board.unsetSnake(firstPos.x, firstPos.y);
        }
        this.game.board.setSnake(newPos.x, newPos.y, this);
        return true;
    }
    
    moveTail() {
        if(this.#body.length > 0) {
            let firstPos = this.#body.shift();
            this.game.board.unsetSnake(firstPos.x, firstPos.y);
        }
    }
    
    checkCollision(pos) {
        if(pos.x >= dim.w || pos.x < 0 || pos.y < 0 || pos.y >= dim.h ) {return true;} // boundaries
        //if(this.body.find(point => point.x === pos.x && point.y === pos.y)) return true; //own body (not needed, next check also checks for own snake parts
        if(this.game.board.isSnake(this.game.board.getPixel(pos.x, pos.y))) return true; // other snakes
        return false;
    }
}
