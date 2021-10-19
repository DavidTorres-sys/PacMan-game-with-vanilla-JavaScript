import gameBoard from './gameMap.js';

const wallSize = 32;
const speed = 2;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const gameMap = new gameBoard(wallSize);
const pacman = gameMap.doPacman(speed);
const ghosts =  gameMap.doGhosts(speed);

let gameOver = false;
let gameWin = false;

const gameOverSound = new Audio("sounds/gameOver.wav");
const gameWinSound = new Audio("sounds/gameWin.wav");

function loop(){
  gameMap.draw(ctx);

  drawGameEnd();

  pacman.draw(ctx, pause(), ghosts);
  ghosts.forEach(ghost => ghost.draw(ctx, pause(), pacman));

  checkGameOver();
  checkGameWin();
  
}

function checkGameWin(){
  if(!gameWin){
    gameWin = gameMap.win();
    if(gameWin){
      gameWinSound.play();
    }
  }
}

function checkGameOver(){
  if(!gameOver){
    gameOver = isGameOver();
    if(gameOver){
      gameOverSound.play();
    }
  }
}

function isGameOver(){
  return ghosts.some((ghost) => !pacman.powerDotActive &&
  ghost.collideWithPacman(pacman)
  );
}

function pause(){
  return !pacman.madeFirstMove || gameOver || gameWin;
}

function drawGameEnd(){
  if(gameWin || gameOver){
    let text = " Victoria!";
    if(gameOver){
      text = "You Died";
    }
    ctx.fillStyle = "black";
    ctx.fillRect(0, canvas.height / 2.5, canvas.width, 80);

    ctx.font = "75px comic sans";

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop("0", "black");
    gradient.addColorStop("0.5", "red");
    gradient.addColorStop("1.0", "red");

    ctx.fillStyle = gradient;
    ctx.fillText(text, 170, canvas.height / 2);
  }
}

gameMap.setCanvasSize(canvas);
setInterval(loop, 1000/75);