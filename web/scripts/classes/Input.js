export default class Input {
  constructor() {
    this.pressedKeys = {};
  }

  init() {
    document.addEventListener("keydown", (event) => {
      this.pressedKeys[event.key] = true;
    });

    document.addEventListener("keyup", (event) => {
      this.pressedKeys[event.key] = false;
    });
  }

  isPressed(key) {
    return this.pressedKeys[key];
  }
}
