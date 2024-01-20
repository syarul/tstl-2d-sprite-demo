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

type n = number;

type quad = [n, n, n, n, n, n];

// create an entity class
class GameEntity {
  pos: Vector;
  sprite: string;
  spriteQuad: Quad;
  constructor(pos: Vector, sprite: string, quadParams: quad) {
    this.pos = pos;
    this.sprite = sprite;
    this.spriteQuad = love.graphics.newQuad(...quadParams);
  }
  draw() {
    const sp: Image = love.graphics.newImage(this.sprite);
    love.graphics.draw(sp, this.spriteQuad, this.pos.x, this.pos.y);
  }
}

const keys: KeyConstant[] = ["w", "a", "s", "d"];
const quadPos: number[] = [192, 64, 0, 128];
const extraKeys: KeyConstant[] = ["up", "left", "down", "right"];

function setPos(ctx: Player, direction: KeyConstant) {
  if (direction === "down") ctx.pos.y += ctx.step;
  if (direction === "up") ctx.pos.y -= ctx.step;
  if (direction === "left") ctx.pos.x -= ctx.step;
  if (direction === "right") ctx.pos.x += ctx.step;
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
    ctx.lastKey = key;
    ctx.lastKeyExtra = direction;
    ctx.lastQuadPos = targetY;
    ctx.lastDirection = direction;
  }
  // when ever the character endup in middle of a walking pos
  // indicate by quad 64/192, finish it to the next idle pos
  if (finish === true && (x === 64 || x === 192)) {
    ctx.spriteQuad.setViewport(x === 192 ? 0 : x + w, targetY, w, h);
    setPos(ctx, ctx.lastDirection);
  }
}

interface state {
  delay: number;
  timeSinceLastUpdate: number;
  isMoved: boolean;
}

const gameState: state = {
  delay: 0.1,
  timeSinceLastUpdate: 0,
  isMoved: false,
};

// define a player class
class Player extends GameEntity {
  tlu: number; // timeSinceLastUpdate
  isKeyDown: boolean; // if key is press state
  lastKey!: KeyConstant;
  lastKeyExtra!: KeyConstant;
  lastQuadPos!: number;
  lastDirection!: KeyConstant;
  step: number;
  constructor(pos: Vector, sprite: string, step: number, quadParams: quad) {
    super(pos, sprite, quadParams);
    this.step = step;
    this.tlu = 0;
    this.isKeyDown = false;
  }
  update(dt: number) {
    this.tlu += dt;
    this.isKeyDown = false;
    let keyCounts: KeyConstant[] = [];
    keys.map((key: KeyConstant, i: number): void => {
      if (
        love.keyboard.isDown(key) ||
        (love.keyboard.isDown(extraKeys[i]) && !keyCounts.includes(key))
      ) {
        gameState.isMoved = true;
        this.isKeyDown = true;
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
    if (this.tlu >= gameState.delay && gameState.isMoved && !this.isKeyDown) {
      this.tlu = 0;
      gameState.isMoved = false;
      setViewportByDirection(
        this,
        this.lastKey,
        this.lastKeyExtra,
        this.lastQuadPos,
        true,
      );
    }
  }
}

const player = new Player(
  new Vector(370, 250),
  "res/char.png",
  8,
  [0, 0, 64, 64, 256, 256],
);

love.update = function (dt: number) {
  gameState.timeSinceLastUpdate += dt;

  // add delay since the pressing keyboard will trigger event loop
  if (gameState.timeSinceLastUpdate >= gameState.delay) {
    player.update(dt);
    gameState.timeSinceLastUpdate = 0;
  }
};

love.load = () => {};

love.draw = () => {
  player.draw();
};
