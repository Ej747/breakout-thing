const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// ball location and parameters
let x = canvas.width/2;
let y = canvas.height-30;
const dx1 = 3;
const dy1 = -3;
let dx = dx1;
let dy = dy1;
const ballRadius = 10;

// paddle 
let paddleWidth = 120;
const paddleHeight = 10;
let paddleX = (canvas.width - paddleWidth) / 2;
// control
let rightPressed = false;
let leftPressed = false;

// bricks
const brickRowCount = 8;
const brickColumnCount = 12;
const brickWidth = 60;
const brickHeight = 20;
const brickPadding = 5;
const brickOffsetTop = 30;
const brickOffsetLeft = (canvas.width - (brickWidth * brickColumnCount) - (brickPadding * (brickColumnCount - 1))) / 2;
let bricks = [];
brickColors = ["#ff0000", "#ff0000", "#ff9d00", "ff9d00", "#18cc00", "#18cc00", "#dbdb00", "#dbdb00"];

for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = {x:0, y:0, status: 1};
    }
}

let score = 0;
let lives = 3;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

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

function mouseMoveHandler(e) {
    let relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, 2*Math.PI);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#00a6ff";
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
                ctx.fillStyle = brickColors[r];
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
                    score++;
                }
                if (x + ballRadius >= b.x && x - ballRadius <= b.x + brickWidth && y >= b.y && y <= b.y + brickHeight) {
                    dx = -dx;
                    b.status = 0;
                    score++;
                }
                if (score === brickRowCount * brickColumnCount) {
                    alert("YOU WIN, CONGRATS!");
                    document.location.reload();
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#f0f0f0";
    ctx.fillText(`Score: ${score}`, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#f0f0f0";;
    ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}

function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawPaddle();
    drawScore();
    drawLives();
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
        paddleWidth = 60;
    }
    // ends game if ball hits the bottom
    if (y + ballRadius >= canvas.height) {
        lives--;
        if (lives === 0) {
            drawLives();
            alert("Game Over");
            document.location.reload();
        } else {
            x = canvas.width / 2;
            y = canvas.height - 30;
            dx = dx1;
            dy = dy1;
            paddleX = (canvas.width - paddleWidth) / 2;
        }
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

    requestAnimationFrame(draw);
}

function startGame() {
    draw();
}

document.getElementById("runButton").addEventListener("click", function() {
    startGame();
    this.disabled = true;
});