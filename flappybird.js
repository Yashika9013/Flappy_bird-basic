

let board;
let boardWidth = 360;
let boardHeight = 640;
let context

// bird
let birdWidth = 34; // width/height ratio = 408/228 = 17/12
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
}


//pipes
let pipeArray = [];
let pipeWidth = 200; // width/height ratio = 494/ 505 = 1/8 
let pipeHeight = 505;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

// physics 
let velocityX = -2; // pipes moving left speed 
let velocityY = 0; // bird jump speed 
let gravity = 0.4;

let gameOver = false;
let score = 0;



window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); // used for drawing on the board 

    // draw flappy bird
    // context.fillStyle = "green"; 
    //context.fillRect(bird.x , bird.y , bird.width , bird.height);

    //load image 
    birdImg = new Image();
    birdImg.src = "./Flappybird copy.png"
    birdImg.onload = function () {
        context.drawImage(birdImg, bird.x, bird.y, bird.height, bird.width);
    }
    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";
    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    

    requestAnimationFrame(update);
    setInterval(placePipes, 1500); // every 1.5 sec
    document.addEventListener("keydown", moveBird);
}
function update() {
    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);
    if (gameOver) {
        return;
    }

    // bird
    velocityY += gravity;
    //bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY, 0); // apply gravity to current bird.y limit the bird.y to top of the canvas 
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    if (bird.y > board.height) {
        gameOver = true;
    }


    //pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);


        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;// 0.5 because there are 2 pipe count 
            pipe.passed = true;
        }
        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }
    // clear pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); // remove first element from the array

    }
    // score
    context.fillStyle = "White";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);
    if (gameOver) {
        context.fillText("GAME OVER", 5, 90);
    }


}
function placePipes() {
    if (gameOver) {
        return;
    }
    // (0-1) * pipeHieght / 2 
    //
    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = board.height / 4;
    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false

    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        velocityY = -6;
    }
}
// reset game 
if (gameOver) {
    bird.y = birdY;
    pipeArray = [];
    score = 0;
    gameOver = false;
}

function detectCollision(a, b) {
    return a.x < b.x  &&
        a.x   > b.x && a.y < b.y  &&
        a.y + a.height > b.y;
}