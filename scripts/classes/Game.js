export default class Game {
  constructor(world) {
    this.world = world;
  }

  start() {
    document.dispatchEvent(new CustomEvent("start"));

    setInterval(() => {
      this.update();
    }, 1000 / 60);
  }

  update() {
    document.dispatchEvent(new CustomEvent("update"));
  }
}
