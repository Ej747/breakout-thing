const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let interval = 0;

// ball location and parameters
let x = canvas.width/2;
let y = canvas.height-30;
let dx = 2;
let dy = -2;
const ballRadius = 10;

// paddle 
const paddleWidth = 100;
const paddleHeight = 10;
let paddleX = (canvas.width - paddleWidth) / 2;
// control
let rightPressed = false;
let leftPressed = false;

// bricks
const brickRowCount = 4;
const brickColumnCount = 10;
const brickWidth = 70;
const brickHeight = 20;
const brickPadding = 5;
const brickOffsetTop = 30;
const brickOffsetLeft = 15;
let bricks = [];

for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = {x:0, y:0, status: 1};
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.key === "ArrowRight" || e.key === "Right") {
        rightPressed = true;
    }
    else if(e.key === "ArrowLeft" || e.key === "Left") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key === "ArrowRight" || e.key === "Right") {
        rightPressed = false;
    }
    else if(e.key === "ArrowLeft" || e.key === "Left") {
        leftPressed = false;
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, 2*Math.PI);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "green";
    ctx.fill();
    ctx.closePath();

}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
                if (y - ballRadius <= b.y + brickHeight && y + ballRadius >= b.y && x >= b.x && x <= b.x + brickWidth) {
                    dy = -dy;
                    b.status = 0;
                }
                if (x + ballRadius >= b.x && x - ballRadius <= b.x + brickWidth && y >= b.y && y <= b.y + brickHeight) {
                    dx = -dx;
                    b.status = 0;
                }
            }
        }
    }
}

function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawPaddle();
    collisionDetection();
    drawBricks();
    drawBall();
    // gives the ball a velocity
    x += dx;
    y += dy;

    // bounces the ball off the side walls
    if (x - ballRadius <= 0 || x + ballRadius >= canvas.width) {
        dx = -dx;
    }
    // bounces the ball off the top wall
    if (y - ballRadius <= 0) {
        dy = -dy;
    }
    // ends game if ball hits the bottom
    if (y + ballRadius >= canvas.height) {
        alert("Game Over");
        document.location.reload();
        clearInterval(interval);
    }
    // moves the paddle
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 5;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 5;
    }
    // bounces the ball off the paddle
    if (x > paddleX && x < paddleX + paddleWidth && y + ballRadius > canvas.height - paddleHeight) {
        dy = -dy;
    }
}

function startGame() {
    // repeats draw function every 10ms
    interval = setInterval(draw, 10);
}

document.getElementById("runButton").addEventListener("click", function() {
    startGame();
    this.disabled = true;
});