# ╰(°▽°)╯ TSTL Demo! ╰(°▽°)╯

> LÖVE 2D TypeScript to Lua Sprite Character Movement

https://github.com/syarul/tstl-2d-sprite-demo/assets/2774594/b8349957-d16e-4ab6-a5c1-0c5d0042f123

## Features & Updates

- You can move with WASD or up, left, down and right keys
- Added step to move the player position and also playing the sprites animation
- Only accept one key movement at a time, which mean only vertical or horizontal move **limited by the sprites**
- Added a delay event after a key release to do one last movement to idle pos incase the player is in the middle walking pos

You can also check the initial bare minimum code to see how to load sprites in `src/main_bare.ts`

Asset is taken from [https://i.pinimg.com/originals/a6/47/f3/a647f30563977110e6bef77d171e00db.png](https://i.pinimg.com/originals/a6/47/f3/a647f30563977110e6bef77d171e00db.png)

## Scripts

Requires [NodeJS](https://nodejs.org/en/download/) and [LÖVE 2D](https://love2d.org/) within your CLI.

| Command                | Description                                      |
| ---------------------- | ------------------------------------------------ |
| `npm install`          | ⏬ Install dependencies                          |
| `npm run build`        | 🔨 Build everything                              |
| `npm run watch`        | 🔨x♾ Re-build Lua files when a TS file is saved |
| `npm start`            | 🎮 Start the game                                |
| `npm run fix:prettier` | 💄 Fixes linting issues                          |
| `npm run lint`         | 💄 Checks for linting issues in code             |

### Links

Build from

- [LÖVE 2D TypeScript Project Template](https://github.com/hazzard993/love-typescript-template)
