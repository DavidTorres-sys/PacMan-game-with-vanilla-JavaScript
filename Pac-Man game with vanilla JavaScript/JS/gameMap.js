import MovingDirection from "./control.js";
import Pacman from "./pacman.js";
import Ghosts from "./ghosts.js"

export default class GameBoard{

  #wallSize;
  #board = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
    [1, 7, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 7, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1],
    [1, 1, 1, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 1, 1, 1],
    [1, 1, 1, 1, 2, 1, 2, 1, 6, 6, 6, 6, 1, 2, 1, 2, 1, 1, 1, 1],
    [1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1],
    [1, 2, 2, 2, 7, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 7, 2, 2, 2, 1],
    [1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1],
    [1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1],
    [1, 1, 1, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 1, 1, 1],
    [1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 7, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 7, 1],
    [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ];

  constructor(wallSize){
    this.#wallSize = wallSize;

    this.wall = new Image();
    this.wall.src = "images/wall.png";

    this.yellowDot = new Image();
    this.yellowDot.src = "images/yellowDot.png";

    this.pinkDot = new Image();
    this.pinkDot.src = "images/pinkDot.png";

    this.powerDot = this.pinkDot;
    this.powerDotAnmationTimerDefault = 50;
    this.powerDotAnmationTimer = this.powerDotAnmationTimerDefault;

  }

  draw(ctx){
    for(let row = 0; row < this.#board.length; row++){
      for(let column = 0; column < this.#board[row].length; column++){
        let wall = this.#board[row][column];

        if (wall === 1){
          this.#drawWall(ctx, column, row, this.#wallSize)
        }
          else if(wall === 2){
            this.#drawDots(ctx, column, row, this.#wallSize)
          }
          else if(wall === 7){
            this.#drawPowerDots(ctx, column, row, this.#wallSize)
          }
        else{
          this.#drawBlank(ctx, column, row, this.#wallSize)
        }
      }
    }
  }
  
  doPacman(speed){
    for(let row = 0; row < this.#board.length; row++){
      for(let column = 0; column < this.#board[row].length; column++){
        let wall = this.#board[row][column];
        if(wall === 5){
          this.#board[row][column] = 2;
          return new Pacman(
            column * this.#wallSize,
            row * this.#wallSize,
            this.#wallSize,
            speed,
            this
            );
        } 
      }
    }
  }

  doGhosts(speed){
    const ghost = [];
    for(let row = 0; row < this.#board.length; row++){
      for(let column = 0; column < this.#board[row].length; column++){
        const wall = this.#board[row][column];
        if(wall === 6){
          this.#board[row][column] = 2;
          ghost.push(new Ghosts(
            column * this.#wallSize,
            row * this.#wallSize,
            this.#wallSize,
            speed,
            this
          ));
        }
      }
    }
    return ghost;
  }
  
  collide(xFocus, yFocus, direction){
    if(direction == null){
      return;
    }
    if(Number.isInteger(xFocus / this.#wallSize) &&
    Number.isInteger(yFocus / this.#wallSize)){

      let column = 0;
      let row = 0;
      let nextColumn = 0;
      let nextRow = 0;

      switch(direction){
        case MovingDirection.up:
          nextRow = yFocus - this.#wallSize;
          row = nextRow / this.#wallSize;
          column = xFocus / this.#wallSize;
        break;

        case MovingDirection.down:
          nextRow = yFocus + this.#wallSize;
          row = nextRow / this.#wallSize;
          column = xFocus / this.#wallSize;
        break;

        case MovingDirection.right:
          nextColumn = xFocus + this.#wallSize;
          column = nextColumn / this.#wallSize;
          row = yFocus / this.#wallSize;
        break;

        case MovingDirection.left:
          nextColumn = xFocus - this.#wallSize;
          column = nextColumn / this.#wallSize;
          row = yFocus / this.#wallSize;
        break;
      }
      const wall = this.#board[row][column];
      if (wall === 1) {
        return true;
      }
    }
    return false;
  }

  eatPowerDots(xFocus, yFocus){
    const row = yFocus / this.#wallSize;
    const column = xFocus / this.#wallSize;
    if(Number.isInteger(row) 
    && Number.isInteger(column)){
      if(this.#board[row][column] === 7){
        this.#board[row][column] = 0;
        return true;
      }
    }
    return false;
  }

  eatDots(xFocus, yFocus){
    const row = yFocus / this.#wallSize;
    const column = xFocus / this.#wallSize;

    if(Number.isInteger(row) 
    && Number.isInteger(column)){
      if(this.#board[row][column] === 2){
        this.#board[row][column] = 0;
        return true;
      }
    }
    return false;
  }

  win(){
    return this.#dotsLeft() === 0;
  }

  #dotsLeft(){
    return this.#board.flat().filter((wall) => wall === 2).length
  }

  #drawDots(ctx, column, row, size){
    ctx.drawImage(
      this.yellowDot, 
      column * this.#wallSize, 
      row * this.#wallSize, 
      size, 
      size
    );
  }

  #drawPowerDots(ctx, column, row, size){
   this.powerDotAnmationTimer--;
    if(this.powerDotAnmationTimer === 0){
      this.powerDotAnmationTimer = this.powerDotAnmationTimerDefault;
      if(this.powerDot == this.pinkDot){
        this.powerDot = this.yellowDot;
      }
      else{
        this.powerDot = this.pinkDot;
      }
    }
    ctx.drawImage(
      this.powerDot, 
      column * this.#wallSize, 
      row  * this.#wallSize, 
      size,
      size)
  }
  
  #drawBlank(ctx, column, row, size){
    ctx.fillStyle = "black";
    ctx.fillRect(column * this.#wallSize, row * this.#wallSize, size, size)
  }
  #drawWall(ctx, column, row, size){
    ctx.drawImage(
      this.wall, 
      column * this.#wallSize, 
      row * this.#wallSize, 
      size, 
      size
    );
  }

  setCanvasSize(canvas){
    canvas.width = this.#board[0].length * this.#wallSize;
    canvas.height = this.#board.length * this.#wallSize;
  }
}