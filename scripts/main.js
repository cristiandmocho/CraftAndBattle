import { Engine, Vector2 } from "./classes/Engine.js";
import Game from "./classes/Game.js";
import Camera from "./classes/Camera.js";
import Input from "./classes/Input.js";

(() => {
  const engine = new Engine();
  const World = document.querySelector(".world");
  const Layers = {
    Props: World.querySelector(".props-layer"),
  };

  function init() {
    const game = new Game(World);
    const mainCamera = new Camera(0, 0, World);
    const input = new Input();

    document.addEventListener("start", () => {
      PlaceProps();
    });

    document.addEventListener("update", () => {
      ReadInput();
    });

    input.init();
    game.start();

    let dir = new Vector2(0, 0);
    let speed = 1;

    function ReadInput() {
      if (input.isPressed("Shift")) speed = 10;
      else speed = 1;

      if (input.isPressed("ArrowUp"))
        dir = Vector2.Lerp(dir, new Vector2(0, 1), engine.deltaTime);
      else dir = Vector2.Lerp(dir, new Vector2(0, 0), engine.deltaTime);

      if (input.isPressed("ArrowDown"))
        dir = Vector2.Lerp(dir, new Vector2(0, -1), engine.deltaTime);
      else dir = Vector2.Lerp(dir, new Vector2(0, 0), engine.deltaTime);

      if (input.isPressed("ArrowLeft"))
        dir = Vector2.Lerp(dir, new Vector2(1, 0), engine.deltaTime);
      else dir = Vector2.Lerp(dir, new Vector2(0, 0), engine.deltaTime);

      if (input.isPressed("ArrowRight"))
        dir = Vector2.Lerp(dir, new Vector2(-1, 0), engine.deltaTime);
      else dir = Vector2.Lerp(dir, new Vector2(0, 0), engine.deltaTime);

      MoveCamera(dir, speed);
    }

    function MoveCamera(dir, speed) {
      mainCamera.move(dir.x, dir.y, speed);
    }
  }

  function PlaceProps() {
    for (let i = 0; i < 1000; i++) {
      const props = ["flowers"];

      props.forEach((prop) => {
        const posX =
          16 + Math.floor(Math.random() * Layers.Props.offsetWidth - 32);
        const posY =
          16 + Math.floor(Math.random() * Layers.Props.offsetHeight - 32);

        const $prop = document.createElement("div");
        $prop.classList.add("prop", prop);
        Layers.Props.appendChild($prop);

        $prop.style.left = `${posX}px`;
        $prop.style.top = `${posY}px`;
      });
    }
  }

  init();
})();
