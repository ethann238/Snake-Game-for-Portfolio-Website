// Define HTML elements
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
/*const logo = document.getElementById('logo');*/
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');
const gameOverText = document.getElementById('game-over');
gameOverText.style.display = 'none';
// Define game variables
const gridSize = 20;
let snake = [{x: 10, y: 10}];
let food = generateFood();
let highScore = 0;
let direction = 'up';
let gameInterval;
let gameSpeedDelay = 200; //Speed of the snake
let gameStarted = false;

//Draw game map, snake, food
function draw() {
    //Resets the board
    board.innerHTML = '';

    drawSnake();
    drawFood();
    updateScore();
}

// Draw snake
function drawSnake() {
    if(gameStarted) {
        snake.forEach((segment) => {
            const snakeElement = createGameElement('div', 'snake');
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
        });
    }

}

// Create a snake or food cube/div
function createGameElement(tag, className) {
    //Creates a new tag inside the javascript
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

// Set the position of snake or food
function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
} 

// Draw food function
function drawFood() {
    if(gameStarted) {
        const foodElement = createGameElement('div', 'food');
        setPosition(foodElement, food);
        board.appendChild(foodElement);
    }
}

// Generate food
function generateFood() {
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    return {x, y};
}

// Moving the snake
function move() {
    // A copy of the 0th index in snake
    const head = {...snake[0]}
    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'right':
            head.x++;
            break;
        case 'left':
            head.x--;
            break;
        case 'down':
            head.y++;
            break;
    }
    //Adds a head object to the beginning of the snake array
    snake.unshift(head);
    
    //If snake collides with food, add to the length of snake
    if(head.x === food.x && head.y === food.y) {
        food = generateFood();
        increaseSpeed();
        clearInterval(gameInterval); //Clear past interval
        gameInterval = setInterval(() => {
            move();
            checkCollision();
            draw();
        }, gameSpeedDelay);
    } else {
        //Removes the last object in snake
        snake.pop();
        //So we are adding a new element and then removing another 
        //to make it look like it is moving
    }
}

function startGame() {
    gameStarted = true; // Keep track of a running game
    //Hide text and image
    instructionText.style.display = 'none';
    /*logo.style.display = 'none';*/
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

// Keypress event listener
function handleKeyPress(event) {
    //Handles different browsers for space, starts game
    if((!gameStarted && event.code === 'Space') || (!gameStarted && event.key === ' ')) {
        startGame();
    } else {
        switch (event.key) {
            case 'ArrowUp':
                if(direction != 'down') {
                    direction = 'up';
                }
                break;
            case 'ArrowDown':
                if(direction != 'up') {
                    direction = 'down';
                }
                break;
            case 'ArrowLeft':
                if(direction != 'right') {
                    direction = 'left';
                }
                break;
            case 'ArrowRight':
                if(direction != 'left') {
                    direction = 'right';
                }
                break;
        }
    }
} 

document.addEventListener('keydown', handleKeyPress);

function increaseSpeed() {
    if (gameSpeedDelay > 150) {
        gameSpeedDelay -= 4;
    } else if (gameSpeedDelay > 100) {
        gameSpeedDelay -= 3;
    } else if (gameSpeedDelay > 50) {
        gameSpeedDelay -= 2;
    } else if (gameSpeedDelay > 25) {
        gameSpeedDelay -= 1;
    }
}

function checkCollision() {
    const head = snake[0];

    //Collided with a wall
    if(head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
        gameOverText.style.display = 'block';
        clearInterval(gameInterval);
        setTimeout(resetGame, 2000);
    }

    //Collided with itself
    for(let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) { 
            gameOverText.style.display = 'block';
            clearInterval(gameInterval);
            setTimeout(resetGame, 2000);
        }
    }
}

function resetGame() {
    gameOverText.style.display = 'none';
    updateHighScore();
    stopGame();
    snake = [{x: 10, y: 10}];
    food = generateFood();
    direction = 'up';
    gameSpeedDelay = 200;
    updateScore();
}

function updateScore() {
    const currentScore = snake.length -1;
    //Makes it a triple digit number
    score.textContent = currentScore.toString().padStart(3, '0');
}

function stopGame() {
    gameStarted = false;
    /*gameInterval = setInterval(() => {
        //move();
        //checkCollision();
        draw();
    }, gameSpeedDelay);
    clearInterval(gameInterval);*/
    draw();
    instructionText.style.display = 'block';
    /*logo.style.display = 'block';*/
}

function updateHighScore() {
    const currentScore = snake.length - 1;
    if(currentScore > highScore) {
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3, '0');
    }
    highScoreText.style.display = 'block';
}

