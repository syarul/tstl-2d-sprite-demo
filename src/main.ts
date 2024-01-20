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

let lastKey: KeyConstant;
let lastKeyExtra: KeyConstant;
let lastQuadPos: number;
let lastDirection: KeyConstant;

const step: number = 8;
const keys: KeyConstant[] = ["w", "a", "s", "d"];
const quadPos: number[] = [192, 64, 0, 128];
const extraKeys: KeyConstant[] = ["up", "left", "down", "right"];

function setPos(ctx: Player, direction: KeyConstant) {
  if (direction === "down") ctx.pos.y += step;
  if (direction === "up") ctx.pos.y -= step;
  if (direction === "left") ctx.pos.x -= step;
  if (direction === "right") ctx.pos.x += step;
}

function setViewportByDirection(
  ctx: Player,
  key: KeyConstant,
  direction: KeyConstant,
  targetY: number,
  finish: boolean,
) {
  const [x, y, w, h] = ctx.spriteQuad.getViewport();
  let posX = x + w === 256 ? 0 : x + w;
  if (love.keyboard.isDown(key, direction)) {
    ctx.spriteQuad.setViewport(y !== targetY ? x : posX, targetY, w, h);
    // move the player around, add constant step how far
    // the player move per tick
    setPos(ctx, direction);
    lastKey = key;
    lastKeyExtra = direction;
    lastQuadPos = targetY;
    lastDirection = direction;
  }
  // when ever the character endup in middle of a walking pos
  // indicate by quad 64/192, finish it to the next idle pos
  if (finish === true && (x === 64 || x === 192)) {
    const [x, y, w, h] = ctx.spriteQuad.getViewport();
    ctx.spriteQuad.setViewport(x === 192 ? 0 : x + w, targetY, w, h);
    setPos(ctx, lastDirection);
  }
}

let delay = 0.1;
let timeSinceLastUpdate = 0;
let tlu = 0;

let isMoved = false;
// define a player class
class Player extends GameEntity {
  constructor(pos: Vector, sprite: string) {
    super(pos, sprite);
  }
  update(dt: number) {
    tlu += dt;
    let keyCounts: KeyConstant[] = [];
    let isLocalMoved = false;
    keys.map((key: KeyConstant, i: number): void => {
      if (
        love.keyboard.isDown(key) ||
        (love.keyboard.isDown(extraKeys[i]) && !keyCounts.includes(key))
      ) {
        isMoved = true;
        isLocalMoved = true;
        keyCounts.push(key);
      } else {
        keyCounts = keyCounts.filter((k) => k !== key);
      }
    });
    // only trigger movement when a single key is press
    if (keyCounts.length === 1) {
      keys.map((key: KeyConstant, i: number) => {
        setViewportByDirection(this, key, extraKeys[i], quadPos[i], false);
      });
    }
    // when a key is released trigger another movement after a delay
    if (tlu >= delay && isMoved && !isLocalMoved) {
      tlu = 0;
      isMoved = false;
      setViewportByDirection(this, lastKey, lastKeyExtra, lastQuadPos, true);
    }
  }
}

const player = new Player(new Vector(370, 250), "res/char.png");

love.update = function (dt: number) {
  timeSinceLastUpdate += dt;

  // add delay since the keyboard event is way to fast
  if (timeSinceLastUpdate >= delay) {
    player.update(dt);
    timeSinceLastUpdate = 0;
  }
};

love.load = () => {};

love.draw = () => {
  player.draw();
};
