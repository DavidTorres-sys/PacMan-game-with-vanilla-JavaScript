import MovingDirection from "./control.js";

export default class Pacman{
  #wallSize;
  #speed;
  #wallMap;
  #xFocus;
  #yFocus;

  constructor(xFocus, yFocus, wallSize, speed, wallMap){

    this.#wallSize = wallSize;
    this.#speed = speed;
    this.#wallMap = wallMap;
    this.#xFocus = xFocus;
    this.#yFocus = yFocus;

    this.rotation = this.rotationPacman.right;
    this.madeFirstMove = false;

    this.currentMovingDirection = null;
    this.requestedMovingDirection = null;

    this.pacmanAnimationTimerDefault = 10;
    this.pacmanAnimationTimer = null;

    this.pacmanSound = new Audio("sounds/waka.wav");
    this.powerDotSound = new Audio("sounds/power_dot.wav");
    this.eatGhostSound = new Audio("sounds/eat_ghost.wav");

    this.powerDotActive = false;
    this.powerDotAboutToExpire = false;
    this.timer = [];

    document.addEventListener("keydown", this.#keydown);

    this.#loadPacmanImages();
  }

  draw(ctx, pause, ghosts){
    if(!pause){
      this.#move();
      this.#animationPacman();
    }

    this.#eatGhosts(ghosts);
    this.#eatDots();
    this.#eatPowerDots();

    const size = this.#wallSize / 2

    ctx.save();
    ctx.translate(
      this.#xFocus + size,
      this.#yFocus + size);
    ctx.rotate((this.rotation * 90 * Math.PI) / 180);
 
    ctx.drawImage(this.pacmanImages[
      this.pacmanImageIndex],
      -size,
      -size,
      this.#wallSize,
      this.#wallSize
    );

    ctx.restore();
  }

  #eatGhosts(ghosts){
    if(this.powerDotActive){
      const collideGhosts = ghosts.filter((ghost) => ghost.collideWithPacman(this));
      collideGhosts.forEach((ghost) => {
        ghosts.splice(ghosts.indexOf(ghost), 1);
        this.eatGhostSound.play()
        setTimeout(() => ghosts.push(ghost), 1000 * 5);
      })
    }
  }

  #eatPowerDots(){
    if(this.#wallMap.eatPowerDots(this.#xFocus, this.#yFocus)){
      this.powerDotSound.play();
      this.powerDotActive = true;
      this.powerDotAboutToExpire = false;
      this.timer.forEach((timer) => clearTimeout(timer));
      this.timer = [];

      let powerDotTimer = setTimeout(() =>{
        this.powerDotActive = false;
        this.powerDotAboutToExpire = false;
      }, 1000 * 4);
      this.timer.push(powerDotTimer);

      let powerDotAboutToExpire = setTimeout(() =>{
        this.powerDotAboutToExpire = true;
      }, 1000 * 2)
      this.timer.push(powerDotAboutToExpire);
    }
  }

  #eatDots(){
    if(this.#wallMap.eatDots(this.#xFocus, this.#yFocus) &&
      this.madeFirstMove){
      this.pacmanSound.play();
    }
  }

  #keydown = (e) =>{

    if(e.keyCode == 38){
      if(this.currentMovingDirection == MovingDirection.down)
        this.currentMovingDirection = MovingDirection.up;
        this.requestedMovingDirection = MovingDirection.up;
        this.madeFirstMove = true;
    }
    if(e.keyCode == 40){
      if(this.currentMovingDirection == MovingDirection.up)
        this.currentMovingDirection = MovingDirection.down;
        this.requestedMovingDirection = MovingDirection.down;
        this.madeFirstMove = true;
    }
    if(e.keyCode == 37){
      if(this.currentMovingDirection == MovingDirection.right)
        this.currentMovingDirection = MovingDirection.left;
        this.requestedMovingDirection = MovingDirection.left;
        this.madeFirstMove = true;
    }
    if(e.keyCode == 39){
      if(this.currentMovingDirection == MovingDirection.left)
        this.currentMovingDirection = MovingDirection.right;
        this.requestedMovingDirection = MovingDirection.right;
        this.madeFirstMove = true;
    }

  }

  #move(){
    if(this.currentMovingDirection !== this.requestedMovingDirection){
      if(Number.isInteger(this.#xFocus / this.#wallSize) &&
      Number.isInteger(this.#yFocus / this.#wallSize)){
        if(!this.#wallMap.collide(
          this.#xFocus, 
          this.#yFocus, 
          this.requestedMovingDirection)
        )
        this.currentMovingDirection = this.requestedMovingDirection;
      }
    }

    if(this.#wallMap.collide(
      this.#xFocus, 
      this.#yFocus,
      this.currentMovingDirection)){
        this.pacmanAnimationTimer == null;
        this.pacmanImageIndex = 1;
      return;
      } 
    else if(this.currentMovingDirection != null &&
      this.pacmanAnimationTimer == null){
      this.pacmanAnimationTimer = this.pacmanAnimationTimerDefault;
    }

    switch(this.currentMovingDirection){
      case MovingDirection.up:
        this.#yFocus -= this.#speed;
        this.rotation= this.rotationPacman.up;
      break;

      case MovingDirection.down:
        this.#yFocus += this.#speed;
        this.rotation= this.rotationPacman.down;
      break;

      case MovingDirection.left:
        this.#xFocus -= this.#speed;
        this.rotation = this.rotationPacman.left;
      break;

      case MovingDirection.right:
        this.#xFocus += this.#speed;
        this.rotation = this.rotationPacman.right;
      break;
    }
  }

  #animationPacman(){
    if(this.pacmanAnimationTimer == null){
      return;
    }
    this.pacmanAnimationTimer--;
      if(this.pacmanAnimationTimer == 0){
        this.pacmanAnimationTimer = this.pacmanAnimationTimerDefault;
        this,this.pacmanImageIndex++;
        if(this.pacmanImageIndex == this.pacmanImages.length){
          this.pacmanImageIndex = 0;
        }
      }
  }

  #loadPacmanImages(){
    const pacmanImage0 = new Image();
    pacmanImage0.src = "images/pac0.png";

    const pacmanImage1 = new Image();
    pacmanImage1.src = "images/pac1.png";

    const pacmanImage2 = new Image();
    pacmanImage2.src = "images/pac2.png";

    const pacmanImage3 = new Image();
    pacmanImage3.src = "images/pac1.png";

    this.pacmanImages = [
      pacmanImage0,
       pacmanImage1, 
       pacmanImage2, 
       pacmanImage3
      ];

    this.pacmanImageIndex = 0;
  }

  rotationPacman ={
    right: 0,
    left: 2,
    up: 3,
    down: 1,
  }

  get xFocus(){
    return this.#xFocus;
  }

  set xFocus(newValue){
    this.#xFocus = newValue;
  }

  get yFocus(){
    return this.#yFocus;
  }

  set yFocus(newValue){
    this.#yFocus = newValue;
  }

}