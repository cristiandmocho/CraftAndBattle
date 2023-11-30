export default class Camera {
  /**
   * @param {number} posX
   * @param {number} posY
   * @param {HTMLElement} world
   */
  constructor(posX, posY, world) {
    this.posX = posX;
    this.posY = posY;
    this.world = world;
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} speed
   */
  move(x, y, speed = 1) {
    this.posX += x * speed;
    this.posY += y * speed;

    // if (this.posX < 0) {
    //   this.posX = 0;
    // }

    // if (this.posY < 0) {
    //   this.posY = 0;
    // }

    // if (this.posX > this.world.offsetWidth) {
    //   this.posX = this.world.offsetWidth;
    // }

    // if (this.posY > this.world.offsetHeight) {
    //   this.posY = this.world.offsetHeight;
    // }

    this.world.style.transform = `translate(${this.posX}px, ${this.posY}px)`;
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  moveTo(x, y) {
    this.posX = x;
    this.posY = y;

    this.world.style.transform = `translate(${this.posX}px, ${this.posY}px)`;
  }
}
