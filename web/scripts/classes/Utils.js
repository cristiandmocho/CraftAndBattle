export default class Utils {
  constructor() {
    throw new Error("Static class");
  }

  // Math
  static randomRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  // Graphics
  static convertAtlasIntoSprites(atlas, width, height) {
    const result = [];
    const rows = atlas.height / height;
    const cols = atlas.width / width;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        result.push({
          x: x * width,
          y: y * height,
          width,
          height,
        });
      }
    }

    return result;
  }
}
