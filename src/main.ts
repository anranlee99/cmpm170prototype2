import "crisp-game-lib";

const title = "";
const description = `
`;
const characters: any = [];

let score = 0;

function renderBlocks(): void {
  for (const block of blocks) {
    box(block.centerX, block.centerY, block.width, block.height);
    color("black");
  }
}

function shiftBoard(): void {
  for (const block of blocks) {
    block.shiftBlockDown();
  }
}

const blocks: BlockConfig[] = [];
class BlockConfig {
  centerX: number = 0;
  centerY: number = 0;
  width: number = 0;
  height: number = 0;
  rightX: number = 0;
  leftX: number = 0;
  topY: number = 0;
  bottomY: number = 0;
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
  shiftBlockDown(): void {
    this.centerY += this.height / 2;
    this.topY += this.height / 2;
    this.bottomY += this.height / 2;
  }
}

function addBlock(x: number, y?: number, width?: number, height?: number) {
  const lastPiece = blocks[blocks.length - 1];
  if (!width) width = 15;
  if (!height) height = 5;
  if (!y) y = lastPiece ? lastPiece.centerY - lastPiece.height / 2 - height / 2 : 100;
  blocks.push(new BlockConfig(x, y, width, height));
  score += 1; // Increment score for each block added
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
    }
    if (this.x + this.width / 2 >= 100) {
      this.dir = -1;
    }
    return this.x + this.speed * this.dir;
  },
  draw() {
    this.x = this.getX();
    box(this.getX(), this.y, this.width, this.height);
    color("black");
  },
};

addBlock(50, 100, 40, 10);

function update() {
  renderBlocks();
  player.draw();

  // Display the score using the text function from crisp-game-lib
  text(`Score: ${score}`, 3, 10);

  if(input.isJustPressed){
    if(blocks.length > 3){
      shiftBoard();
    }
    addBlock(player.x);
  }
  if (!ticks) {
  }
}

init({
  update,
  title,
  description,
  characters,
  options: {},
});
