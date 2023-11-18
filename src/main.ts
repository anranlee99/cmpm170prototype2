import "crisp-game-lib";

const title = "  Block Stacker";
const description = `
   Stack blocks 
        and 
  avoid obstacles.`;

const characters: any[] = [];

class Obstacle {
  constructor(public x: number, public y: number, public size: number) {}

  draw() {
    color("green");
    box(this.x, this.y, this.size, this.size);
    color("black");
  }

  shiftDown(shiftAmount: number) {
    this.y += shiftAmount;
  }
}

let blocks: BlockConfig[] = [];
let obstacles: Obstacle[] = []; // Array to hold obstacles
let obstacleSpacing = 50; // Minimum spacing between obstacles

class BlockConfig {
  centerX: number;
  centerY: number;
  width: number;
  height: number;
  rightX: number;
  leftX: number;
  topY: number;
  bottomY: number;

  constructor(centerX: number, centerY: number, width: number, height: number) {
    this.centerX = centerX;
    this.centerY = centerY;
    this.width = width;
    this.height = height;
    this.rightX = centerX + width / 2;
    this.leftX = centerX - width / 2;
    this.topY = centerY - height / 2;
    this.bottomY = centerY + height / 2;
  }

  shiftBlockDown() {
    this.centerY += this.height;
    this.topY += this.height;
    this.bottomY += this.height;
  }
}

function renderBlocks() {
  for (const block of blocks) {
    color("black");
    box(block.centerX, block.centerY, block.width, block.height);
  }
}

function shiftBoard() {
  for (const block of blocks) {
    block.shiftBlockDown();
  }

  for (const obstacle of obstacles) {
    obstacle.shiftDown(5); // Shift the obstacles down at the same rate as blocks
  }
}

function addBlock(x: number, y?: number, width?: number, height?: number) {
  const lastPiece = blocks[blocks.length - 1];
  if (!width) width = 15;
  if (!height) height = 5;
  if (!y) y = lastPiece ? lastPiece.topY - height / 2 : 100;  
  blocks.push(new BlockConfig(x, y, width, height));
}

function checkMove(currentX: number) {
  const lastPiece = blocks[blocks.length - 1];
  const leftCur = currentX - 7.5;
  const rightCur = currentX + 7.5;

  //console.log(currentX, " ", lastPiece.leftX, " ", lastPiece.rightX);
  //return lastPiece && lastPiece.leftX <= currentX && currentX <= lastPiece.rightX;
  return (
    lastPiece &&
    ((lastPiece.leftX <= leftCur && leftCur <= lastPiece.rightX) ||
      (lastPiece.leftX <= rightCur && rightCur <= lastPiece.rightX))
  );
}

const player = {
  x: 50,
  y: 50,
  width: 15,
  height: 5,
  speed: 0.5,
  dir: 1,
  getX() {
    if (this.x - this.width / 2 <= 0) {
      this.dir = 1;
    } else if (this.x + this.width / 2 >= 100) {
      this.dir = -1;
    }
    return this.x + this.speed * this.dir;
  },
  draw() {
    this.x = this.getX();
    color("black");
    box(this.x, this.y, this.width, this.height);
  },
};

function generateObstacle() {
  const obstacleX = Math.random() * 100; // Random X position
  obstacles.push(new Obstacle(obstacleX, 0, 10)); // Add obstacle at the top
}

function checkCollisionsWithObstacles() {
  const lastPiece = blocks[blocks.length - 1];
  return box(lastPiece.centerX, lastPiece.centerY, lastPiece.width, lastPiece.height).isColliding.rect?.green;
}
let gameover = false;
function resetGame() {
  gameover = false;
  blocks = [];
  obstacles = [];
  addBlock(50, 100, 40, 10);
}

function generateObstacleIfNeeded() {
  if ((obstacles.length === 0 || obstacles[obstacles.length - 1].y > obstacleSpacing) &&
      (obstacles.length === 0 || Math.abs(obstacles[obstacles.length - 1].x - player.x) > player.width)) {
    generateObstacle();
  }
}

function update() {
  renderBlocks();
  player.draw();
  for (const obstacle of obstacles) {
    obstacle.draw();
  }

  if (input.isJustPressed) {
    if(gameover){
      resetGame();
    }
    if (blocks.length > 3) {
      shiftBoard();
      generateObstacleIfNeeded();
    }

    if (checkMove(player.x)) {
      addBlock(player.x);
      addScore(1, vec(player.x, player.y));
    } else {
      end("Game Over");
      gameover = true;
    }
  }
  if (checkCollisionsWithObstacles()) {
    end("Game Over");
    gameover = true;
  }
}

init({
  update,
  title,
  description,
  characters,
  options: {},
});
resetGame();