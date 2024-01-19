import { Image, Quad } from "love.graphics";

let sprite: Image;
let spriteQuad: Quad;
love.load = () => {
  // load the sprite image
  // ref: https://love2d-community.github.io/love-api/#graphics_newImage
  sprite = love.graphics.newImage("res/char.png");
  // create a quad to take 1 of the sprite image stack and draw it later
  // ref: https://love2d-community.github.io/love-api/#graphics_newQuad
  spriteQuad = love.graphics.newQuad(0, 0, 64, 64, 256, 256);
};

love.draw = () => {
  love.graphics.draw(sprite, spriteQuad, 370, 250);
};
