import { Image, Quad } from "love.graphics";
import { KeyConstant } from "love.keyboard";

class Vector {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

// create an entity class
class GameEntity {
  pos: Vector;
  sprite: string;
  spriteQuad: Quad;
  constructor(pos: Vector, sprite: string) {
    this.pos = pos;
    this.sprite = sprite;
    this.spriteQuad = love.graphics.newQuad(0, 0, 64, 64, 256, 256);
  }
  draw() {
    const sp: Image = love.graphics.newImage(this.sprite);
    love.graphics.draw(sp, this.spriteQuad, this.pos.x, this.pos.y);
  }
}

function setViewportByDirection(
  ctx: Player,
  key: KeyConstant,
  direction: KeyConstant,
  targetY: number,
) {
  const [x, y, w, h] = ctx.spriteQuad.getViewport();
  let posX = x + w === 256 ? 0 : x + w;
  if (love.keyboard.isDown(key, direction)) {
    ctx.spriteQuad.setViewport(y !== targetY ? x : posX, targetY, w, h);
  }
}

// define a player class
class Player extends GameEntity {
  constructor(pos: Vector, sprite: string) {
    super(pos, sprite);
  }
  update() {
    setViewportByDirection(this, "s", "down", 0);
    setViewportByDirection(this, "a", "left", 64);
    setViewportByDirection(this, "d", "right", 128);
    setViewportByDirection(this, "w", "up", 192);
  }
}

const player = new Player(new Vector(370, 250), "res/char.png");

let delay = 0.1;
let timeSinceLastUpdate = 0;

love.update = function (dt: number) {
  timeSinceLastUpdate += dt;

  // add delay since the keyboard event is way to fast
  if (timeSinceLastUpdate >= delay) {
    timeSinceLastUpdate = 0;
    player.update();
  }
};

love.load = () => {};

love.draw = () => {
  player.draw();
};
