import Jimp from "jimp";
import { resolve, join } from "node:path";
import { mkdirSync } from "node:fs";

async function convertAtlasIntoSprites(atlasPath, spriteWidth, spriteHeight) {
  try {
    const image = await Jimp.read(atlasPath);
    const sprites = [];
    const width = image.getWidth();
    const height = image.getHeight();

    for (let y = 0; y < height; y += spriteHeight) {
      for (let x = 0; x < width; x += spriteWidth) {
        sprites.push(image.clone().crop(x, y, spriteWidth, spriteHeight));
      }
    }

    return sprites;
  } catch (error) {
    console.log(error);
  }
}

async function saveSprites(sprites, outputDir) {
  const saveDir = resolve(outputDir);

  // Makes sure the output directory exists
  mkdirSync(saveDir, { recursive: true });

  try {
    for (let i = 0; i < sprites.length; i++)
      await sprites[i].writeAsync(resolve(join(saveDir, `${i}.png`)));
  } catch (error) {
    console.log(error);
  }
}

const sprites = await convertAtlasIntoSprites(
  "./web/assets/map-atlas.png",
  16,
  16
);
await saveSprites(sprites, "./web/assets/sprites");
