class AI_Example {
    runToFood(snake) {
        let newPosStraight = snake.nextPosInDir();
        let newPosLeft = snake.nextPosInDir(snake.turnDir("L"));
        let newPosRight = snake.nextPosInDir(snake.turnDir("R"));
        
        let possibleTurns = [];
        if(!snake.checkCollision(newPosStraight)) {
            possibleTurns.push("S"); // Helper Turn "S" for straight
        };
        if(!snake.checkCollision(newPosLeft)) {
            possibleTurns.push("L");
        }
        if(!snake.checkCollision(newPosRight)) {
            possibleTurns.push("R");
        }
        if(possibleTurns.length === 0) {return;}
        
        let wishDir = this.shortestWayToFood(snake);
        let wishTurns = this.weWantToGo(snake, wishDir);
        let possibleWishTurns = [];
        wishTurns.forEach(turn => {
            if(possibleTurns.find(t => t === turn)) possibleWishTurns.push(turn);
        })
        if(possibleWishTurns.length === 0) possibleWishTurns = possibleTurns;
        
        let rng = Math.floor(Math.random()*possibleWishTurns.length); // let RNG decide which direction to turn
        if(possibleWishTurns[rng] === "S") { // for straight do not turn
            return;
        }
        snake.turn(possibleWishTurns[rng]);
    }

    tryToSurvive(snake) {
        let newPosStraight = snake.nextPosInDir();
        let newPosLeft = snake.nextPosInDir(snake.turnDir("L"));
        let newPosRight = snake.nextPosInDir(snake.turnDir("R"));
        let possibleTurns = [];
        if(this.distanceToFood(snake) < 20 || snake.getHealth() < 25) {
            this.setData(snake, 'mode', 'huntFood');
            return this.runToFood(snake);
        }
        this.setData(snake, 'mode', 'moveStraight');
        if(!snake.checkCollision(newPosStraight)) {
            for(let i = 0; i < dim.w; i++) {
                possibleTurns.push("S"); // Helper Turn "S" for straight
            }
        };
        if(!snake.checkCollision(newPosLeft)) {
            possibleTurns.push("L");
        }
        if(!snake.checkCollision(newPosRight)) {
            possibleTurns.push("R");
        }
        if(possibleTurns.length === 0) {return;}
        let rng = Math.floor(Math.random()*possibleTurns.length); // let RNG decide which direction to turn
        if(possibleTurns[rng] === "S") { // for straight do not turn
            return;
        }
        snake.turn(possibleTurns[rng]);
    }

    shortestWayToFood(snake) {
        let foodPos = snake.game.board.getFoodPos();
        let diffX = foodPos.x - snake.getPos().x;
        let diffY = foodPos.y - snake.getPos().y;
        // first check up/down or left/right
        if(Math.abs(diffX) > Math.abs(diffY)) {
            // LEFT/RIGHT
            if(diffX > 0) return "R";
            return "L";
        } else {
            // UP/DOWN
            if(diffY > 0) return "D";
            return "U";
        }
    }

    weWantToGo(snake, dir) {
        if(snake.getDir() === dir) return ["S"];
        if(snake.turnDir("L") === dir) return ["L"];
        if(snake.turnDir("R") === dir) return ["R"];
        // special case: opposite direction > both directions possible
        return ["R", "L"];
    }
    
    distanceToFood(snake) {
        let diff = {
            x: snake.game.board.getFoodPos().x - snake.getPos().x,
            y: snake.game.board.getFoodPos().y - snake.getPos().y};
        return Math.sqrt(Math.pow(diff.x,2) + Math.pow(diff.y,2));
    }
    
    setData(snake, key, value) {
        if(!snake.team_data) {
            snake.team_data = {};
        }
        snake.team_data[key] = value;
    }
    
    getData(snake, key) {
        if(!snake.team_data) {
            snake.team_data = {};
        }
        return snake.team_data[key];
    }
}

var team_example_AI = new AI_Example();
function team_example_runToFood(snake) {
    return team_example_AI.runToFood(snake);
}
function team_example_tryToSurvive(snake) {
    return team_example_AI.tryToSurvive(snake);
}

