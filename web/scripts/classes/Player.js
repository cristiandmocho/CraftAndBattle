export default class Player {
  /**
   * @param {number} posX
   * @param {number} posY
   */
  constructor(element = null) {
    this.posX = 0;
    this.posY = 0;
    this.speed = 2;
    this.element = element;
  }

  init() {
    if (!this.element) return;

    this.element.style.left = `${this.posX}px`;
    this.element.style.top = `${this.posY}px`;
    this.element.style.display = "block";
  }

  move(direction) {
    if (!this.element) return;

    switch (direction) {
      case "ArrowUp":
        this.posY -= this.speed;
        break;
      case "ArrowDown":
        this.posY += this.speed;
        break;
      case "ArrowLeft":
        this.posX -= this.speed;
        break;
      case "ArrowRight":
        this.posX += this.speed;
        break;
    }

    this.element.style.left = `${this.posX}px`;
    this.element.style.top = `${this.posY}px`;
  }
}
