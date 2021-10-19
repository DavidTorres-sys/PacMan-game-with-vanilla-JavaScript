import MovingDirection from "./control.js";

export default class Ghosts{

  #xFocus;
  #yFocus;
  #wallSize;
  #speed;
  #wallMap;

  constructor(xFocus, yFocus, wallSize, speed, wallMap){

    this.#xFocus = xFocus;
    this.#yFocus = yFocus;
    this.#wallSize = wallSize;
    this.#speed = speed;
    this.#wallMap = wallMap;

    this.scaredAboutToExpireTimerDefault = 10;
    this.scaredAboutToExpireTimer = this.scaredAboutToExpireTimerDefault;

    this.directionTimerDefault = this.#randomMoviment(10, 25);
    this.directionTimer = this.directionTimerDefault;

    this.movingDirectionGhosts = Math.floor(
      Math.random() * Object.keys(MovingDirection).length
    );

    this.#loadImages();
  }
  draw(ctx, pause, pacman){
    if(!pause){
      this.#move();
      this.#changeDirection();
    }
    this.#setImages(ctx, pacman);
      ctx.drawImage(
      this.image, 
      this.#xFocus, 
      this.#yFocus, 
      this.#wallSize, 
      this.#wallSize
      )
  }

  collideWithPacman(pacman){
    const size = this.#wallSize / 2;
    if(
      this.#xFocus < pacman.xFocus + size &&
      this.#xFocus + size > pacman.xFocus &&
      this.#yFocus < pacman.yFocus + size &&
      this.#yFocus + size > pacman.yFocus){
      return true;
      }   
    else{
      return false;
    }
  }

  #changeDirection(){
    this.directionTimer --;
    let newMoveDirection = null;
    if(this.directionTimer == 0){
      this.directionTimer = this.directionTimerDefault;
      newMoveDirection = Math.floor(
      Math.random() * Object.keys(MovingDirection).length);
      }
    if(newMoveDirection != null && this.movingDirectionGhosts != newMoveDirection){
      if(Number.isInteger(this.#xFocus / this.#wallSize) &&
        Number.isInteger(this.#yFocus / this.#wallSize)){
        if(!this.#wallMap.collide(this.#xFocus, this.#yFocus, newMoveDirection )){
          this.movingDirectionGhosts = newMoveDirection;
        }
      }
    }
  }

  #move(){
    if(!this.#wallMap.collide(
      this.#xFocus, 
      this.#yFocus, 
      this.movingDirectionGhosts)){

        switch(this.movingDirectionGhosts){
          case MovingDirection.up:
            this.#yFocus -= this.#speed;
          break;

          case MovingDirection.down:
            this.#yFocus += this.#speed;
          break;

          case MovingDirection.left:
            this.#xFocus -= this.#speed;
          break;

          case MovingDirection.right:
            this.#xFocus += this.#speed;
          break;
        }
      }
  }

  #randomMoviment(min,max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  #setImages(ctx, pacman){
    if(pacman.powerDotActive){
      this.#setImagesDotsActive(pacman);
    }
    else{
      this.image = this.normalGhost;
    }
    ctx.drawImage(
      this.image, 
      this.#xFocus, 
      this.#yFocus, 
      this.#wallSize, 
      this.#wallSize
      )
  }

  #setImagesDotsActive(pacman){
    if(pacman.powerDotAboutToExpire){
      this.scaredAboutToExpireTimer--;
      if(this.scaredAboutToExpireTimer === 0){
        this.scaredAboutToExpireTimer = this.scaredAboutToExpireTimerDefault;
        if(this.image === this.scaredGhost){
          this.image = this.scaredGhost2;
        }
        else{
          this.image = this.scaredGhost;
        }
      }
    }
    else{
      this.image = this.scaredGhost;
    }
  }

  #loadImages(){
    this.normalGhost = new Image();
    this.normalGhost.src = "images/ghost.png";

    this.scaredGhost = new Image();
    this.scaredGhost.src = "images/scaredGhost.png";

    this.scaredGhost2 = new Image();
    this.scaredGhost2.src = "images/scaredGhost2.png";

    this.image = this.normalGhost;
  }
}