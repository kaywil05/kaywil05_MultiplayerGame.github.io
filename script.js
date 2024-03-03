// reference code: https://javascript.plainenglish.io/js-tutorial-create-a-ping-pong-game-bc92c9f3011a

//board
let board;
let boardWidth = 600;
let boardHeight = 600;
let content;

//players
let pWidth = 10;
let pHeight = 75;
let pVelocityY = 0; //two paddles can only move on the y-axis

let player1 = {
    x : 10,
    y : boardHeight/2,
    width : pWidth,
    height : pHeight,
    velocityY : pVelocityY
}
let player2 = {
    x : boardWidth - pWidth - 10,
    y : boardHeight/2,
    width : pWidth,
    height : pHeight,
    velocityY : pVelocityY
}

//ball
let bWidth = 10;
let bHeight = 10;
let ball = {
    x : boardWidth / 2,
    y : boardHeight / 2,
    width : bWidth,
    height : bHeight,
    velocityX : 1, //moves left and right
    velocityY : 2 //moves up and down
}
let prevBallPositions = [];
const maxTrailLength = 50;

let player1Score = 0;
let player2Score = 0;

let gameRunning = false;

window.onload = function(){
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //For adding to the board

    //draw player1
    context.fillStyle = "limegreen";
    context.fillRect(player1.x, player1.y, player1.width, player1.height);

    //draw player2
    context.fillStyle = "limegreen";
    context.fillRect(player2.x, player2.y, player2.width, player2.height);

    //startButton
    const startButton = document.getElementById("startButton");
    startButton.addEventListener('click', function(){
        startGame();
    })
    // requestAnimationFrame(update);
    // document.addEventListener("keyup", movePlayer);

    //restart game button
    const restartButton = document.getElementById("restartButton");
    restartButton.addEventListener('click', function(){
        resetButton(1);
    });
}

function startGame(){
    if(!gameRunning){
        gameRunning = true;
        requestAnimationFrame(update);
    }
    
    document.addEventListener("keyup", movePlayer);
}

function update(){
    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);

    context.fillStyle = "limegreen";
    // player1.y += player1.velocityY;
    let nextPlayer1Y = player1.y + player1.velocityY;
    if (!outOfBounds(nextPlayer1Y)) {
        player1.y = nextPlayer1Y;
    }
    context.fillRect(player1.x, player1.y, player1.width, player1.height);

    //draw player2
    // context.fillStyle = "limegreen";
    // player2.y += player2.velocityY;
    let nextPlayer2Y = player2.y + player2.velocityY;
    if (!outOfBounds(nextPlayer2Y)) {
        player2.y = nextPlayer2Y;
    }
    context.fillRect(player2.x, player2.y, player2.width, player2.height);

    //Draw trail line
    // https://stackoverflow.com/questions/20539311/html-canvas-a-line-following-mouse
    // https://www.kirupa.com/canvas/mouse_follow_ease.htm
    let st = .2;
    for(let i = 1; i < prevBallPositions.length; i++){
        context.beginPath();
        context.lineWidth = st;

        //get center of the ball from curr position
        let centerX = prevBallPositions[i - 1].x + ball.width / 2;
        let centerY = prevBallPositions[i - 1].y + ball.height / 2;
        context.moveTo(centerX, centerY);
        context.lineTo(prevBallPositions[i].x +ball.width / 2, prevBallPositions[i].y + ball.height / 2);

        context.strokeStyle = "#B026FF";
        context.stroke();
        context.closePath();
        //increase line thickness gradually
        st += .2;
    }

    //ball
    context.fillStyle = "white";
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    context.fillRect(ball.x, ball.y, ball.width, ball.height);

    //update previous ball positions array
    prevBallPositions.push({x: ball.x, y: ball.y});

    //trim array to only keep last maxTrailLength positions
    // need to shift so it moves with ball
    if(prevBallPositions.length > maxTrailLength){
        prevBallPositions.shift();
    }

    

    if(ball.y <= 0 || ball.y + ball.height >= boardHeight){
        ball.velocityY *= -1; //reverse direction if ball touches top or bottom
    }

    //bounce ball
    if (collision(ball, player1)){
        if(ball.x <= player1.x + player1.width){
            //left side of ball touches right side of player1
            ball.velocityX *= -1;
        }
    }
    else if(collision(ball, player2)){
        if(ball.x + bWidth >= player2.x){
            //right side of ball touches left side of player2
            ball.velocityX *= -1;
        }
    }

    //game over
    if (ball.x < 0){
        player2Score++;
        resetGame(1);
    }
    else if(ball.x  + bWidth > boardWidth){
        player1Score++;
        resetGame(-1);
    }

    //grab score from css, update accordingly
    const player1ScoreElem = document.getElementById('player1Score');
    const player2ScoreElem = document.getElementById('player2Score');
    player1ScoreElem.textContent = player1Score;
    player2ScoreElem.textContent = player2Score;

    //draw dotted line
    for(let i = 10; i < board.height; i+=25){
        context.fillRect(board.width/2 - 10, i, 5, 5);
    }

}

function outOfBounds(yPos) {
    return (yPos < 0 || yPos + pHeight > boardHeight); //yPos represents the top left corner
}

function movePlayer(e) {
    //player1
    if (e.code == "KeyW") {
        player1.velocityY = -3;
    }
    else if (e.code == "KeyS") {
        player1.velocityY = 3;
    }

    //player2 
    if (e.code == "ArrowUp") {
        player2.velocityY = -3;
    }
    else if (e.code == "ArrowDown") {
        player2.velocityY = 3;
    }
}

function collision(a, b){
    return a.x < b.x + b.width && //a top left corner doesn't reach b top right corner
           a.x + a.width > b.x && //a right corner passes b top  left corner
           a.y < b.y + b.height &&  //a top left corner doesn't reach b bottom  left corner
           a.y + a.height > b.y;  //a bottom left corner passes b top left corner
}

function resetGame(direction){
    ball = {
        x : boardWidth / 2,
        y : boardHeight / 2,
        width : bWidth,
        height : bHeight,
        velocityX : direction, //moves left and right
        velocityY : 2 //moves up and down
    }
    //clear line
    prevBallPositions = []
}

function resetButton(direction){
    ball = {
        x : boardWidth / 2,
        y : boardHeight / 2,
        width : bWidth,
        height : bHeight,
        velocityX : 0, //moves left and right
        velocityY : 0 //moves up and down
    }
    //clear line
    prevBallPositions = []

    player1Score = 0;
    player2Score = 0;

    //startButton
    const startButton = document.getElementById("startButton");
    startButton.addEventListener('click', function(){
        resetGame(direction);
    })
}