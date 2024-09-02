let board;
let boardWidth = 1050;
let boardHeight = 450;
let context;

let manWidth = 55;
let manHeight = 90;
let manX = 58;
let manY = boardHeight - manHeight;
let manImg;
let manFrames = [];
let currentFrameIndex = 0;


let man = {
    x: manX,
    y: manY,
    width: manWidth,
    height: manHeight
};

let fire = [];
let fireWidth = 64;
let fireHeight = 100;
let fireX = 900;
let fireY = boardHeight - fireHeight;
let fireImg;

let velocityX = -8;
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;

let loss1 = new Audio("https://codehs.com/uploads/6ffe3ee72f553d0fa2d9ba3d214d1ac0");
loss1.volume = .6;

let loss2 = new Audio("https://codehs.com/uploads/bfb7efa7a0c114d34b858565d4a34782");
loss2.volume = .6;

let loss3 = new Audio("https://codehs.com/uploads/a3a2ceef2d38bcfff2775f08796edae5");
loss3.volume = .6;

let loss4 = new Audio("https://codehs.com/uploads/ef72363a2dc49c87ffc9d951fdf1111c");
loss4.volume = .6;

let jump1 = new Audio("https://codehs.com/uploads/9a4738d3a1d1a0ef970ecd901d8b5681");
jump1.volume = .5;



let jump3 = new Audio("https://codehs.com/uploads/8645055ccaa5c22443ce535584fe6fdd");
jump3.volume = .5;

let background = new Audio("./img/back3d.mp3");
background.volume = 0.5;





function playBackgroundMusic() {
    background.play();
    document.removeEventListener('click', playBackgroundMusic);
}
// not functioning
function mute(){
    if(e.code==='KeyM'){
        background.volume = 0;

    }
}

document.addEventListener('keydown', function   (event) {
    if (event.code === 'Space' || event.code === 'ArrowUp' || event.code=== 'KeyW') {
        playBackgroundMusic();
    }
});

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");
// man animation
    for (let i = 1; i <= 3; i++) {
        let img = new Image();
        img.src = `./img/run${i}.png`;
        manFrames.push(img);
    }
    manImg = manFrames[0];
  
    fireImg = new Image();
    fireImg.src = "./img/cactus1.png";

    requestAnimationFrame(update);
    setInterval(setFire, 1000);
    document.addEventListener('keydown', moveMan);
};

let lastScoreIncrease = 0;
let increaseInterval = 300;
let velocityXIncrement = -0.5;

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        updateBackground();
        return;
        
    }

    context.clearRect(0, 0, board.width, board.height);



    velocityY += gravity;
    man.y = Math.min(man.y + velocityY, manY);
    context.drawImage(manImg, man.x, man.y, man.width, man.height);

    for (let i = 0; i < fire.length; i++) {
        let currentFire = fire[i];
        currentFire.x += velocityX;
        context.drawImage(currentFire.img, currentFire.x, currentFire.y, currentFire.width, currentFire.height);
         //ends game on collide
        if (detectCollision(man, currentFire)) {
            gameOver = true
            manImg.onload = function () {
                context.drawImage(manImg, man.x, man.y, man.width, man.height)
                ranloss();
            }
        }
    }

    if (score - lastScoreIncrease >= increaseInterval) {
        velocityX += velocityXIncrement;
        lastScoreIncrease = score;
    }

    context.fillStyle = "black"
    context.font = "45px sans serif";
    score++;
    context.fillText(score, 5, 35);

    if(gameOver) {
        context.fillText("YOU LOSE",400, 225)
    }

    manImg = manFrames[currentFrameIndex];

    currentFrameIndex = (currentFrameIndex + 1) % manFrames.length;

   
}

function updateBackground() {
    if (gameOver) {
        document.getElementById('board').style.backgroundImage = "url('./img/desertL.png')";
    } else {
        document.getElementById('board').style.backgroundImage = "url('./img/desert2.gif')";
    }
}

function moveMan(e) {
   
    if ((e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') && man.y === manY) {
        velocityY = -11;
        ranJump();

        if(gameOver) {
          man.y=manY;
         fire = [];
           score = 0;
         gameOver = false;
         velocityX = -8;
          document.getElementById('board').style.backgroundImage = "url('./img/desert2.gif')";
    

        }
    }

    
}

function ranloss() {
    let rn = Math.random();

    if (rn > 0 && rn < 1 / 4) {
        loss1.play();
    } else if (rn > 1 / 4 && rn < 2 / 4) {
        loss2.play();
    } else if (rn > 2 / 4 && rn < 3 / 4) {
        loss3.play();
    } else if (rn > 3 / 4 && rn < 1) {
        loss4.play();
    }
}

function ranJump() {
    let rn = Math.random();

    if (rn > 0 && rn < 1 / 3) {
        jump1.play();
    } else if (rn > 1 / 3 && rn < 2 / 3) {
        jump1.play();
    }
}

function setFire() {
    if (gameOver) {
        return;
    }

    let currentFire = {
        img: null,
        x: fireX,
        y: fireY,
        width: fireWidth,
        height: fireHeight
    };

    let placeFireChance = Math.random();
    if (placeFireChance > 0.2) {
        currentFire.img = fireImg;
        fire.push(currentFire);
    }

    if (fire.length > 5) {
        fire.shift();
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}