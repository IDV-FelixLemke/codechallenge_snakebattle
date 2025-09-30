const canvas = document.getElementById("Field");
const ctx = canvas.getContext("2d");

size =     {w: 800, h:800};
gridSize = {w:10, h:10};
dim =      {w: Math.round(size.w/gridSize.w), h: Math.round(size.h/gridSize.h)};


class Game {
    constructor() {
        this.snakes = [];
        this.board = new Board();
        this.#addSnakes();
        this.board.spawnFood();
        this.interval = null;
        this.statusBar = document.getElementById("StatusBar");
    }
    
    #addSnakes() {
        let radius = Math.min(dim.w, dim.h) * 1/3;
        for(let i = 0; i < SnakeAIs.length; i++) {
            let snakeData = SnakeAIs[i];
            let angle = 2*Math.PI/SnakeAIs.length * i;
            let x = Math.round(radius * Math.cos(angle) + dim.w/2);
            let y = Math.round(radius * Math.sin(angle) + dim.h/2);
            this.#addSnake(snakeData, {x:x, y:y});
        };
    }
    
    #addSnake(snakeData, pos) {
        let snake = new Snake(this, snakeData, pos);
        this.snakes.push(snake);
    }
    
    cycle() {
        let livingSnakeCount = 0;
        this.snakes.forEach(snake => {
            if(!snake.alive) {
                snake.moveTail();
                return; // skip dead snakes
            }
            if(!snake.step()) { // snake colission
                snake.alive = false;
            };
            if(snake.alive) livingSnakeCount++;
            if(snake.getPos().x === this.board.foodPos.x && snake.getPos().y === this.board.foodPos.y) {
                snake.eat();
                this.board.spawnFood();
            }
        });
        this.updateStats();
        if(livingSnakeCount === 0) {
            this.stop();
            this.showEndGame();
        }
    }
    
    start() {
        if(!this.interval) {
            this.interval = window.setInterval(this.cycle.bind(this), 50);
        }
    }
    
    stop() {
        if(this.interval) {
            window.clearInterval(this.interval);
            this.interval = null;
        }
    }
    
    updateStats() {
        let teamStatus = "";
        this.snakes.sort((s1,s2) => s1.getScore() === s2.getScore() ? s1.getStepCount() < s2.getStepCount() : s1.getScore() < s2.getScore());
        let place = 0;
        this.snakes.forEach(snake =>  {
            place++;
            teamStatus += `
                <div class="teamStats">
                    <div style="display:flex; flex-direction:row;gap: 1em; align-items:center">
                        <span data-alive="${snake.alive}">${place}. ${snake.team}</span>
                        <div style="width:1em; height:1em; background-color:${snake.color};"></div>
                        <div style="width:40%; height:1em; background-color:grey;border-radius:5px">
                            <div style="width:${snake.getHealth()*0.97}%; height:0.6em; margin:0.2em; background-color:red;border-radius:5px"></div>
                        </div>
                    </div>
                    <span style="font-weight:bold;">Score: ${snake.getScore()}</span>
                </div>
            `;
        });
        this.statusBar.innerHTML = teamStatus;
    }
    
    showEndGame() {
        let highScore = 0;
        let winner = null;
        this.snakes.forEach(snake => {
            if(snake.getScore() === highScore && snake.getStepCount() > winner.getStepCount()) {
                // in case snakes with same score > winner is the snake with more steps
                winner = snake;
            }
            if(snake.getScore() > highScore) {
                highScore = snake.getScore();
                winner = snake;
            }
        });
        document.getElementById("WinnerName").innerHTML = winner.team;
        document.getElementById("WinnerScore").innerHTML = winner.getScore();
        document.getElementById("WinnerSteps").innerHTML = winner.getStepCount();
        document.getElementById("WinnerColor").style.setProperty("background-color", winner.color);
        
        document.getElementById("EndGameOverlay").style.display = "revert";
    }
}

let game = new Game();
game.start();
