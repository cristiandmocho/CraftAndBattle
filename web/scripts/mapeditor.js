(() => {
  const World = document.querySelector(".world");
  const Map = {
    element: World.querySelector(".map"),
    grid: World.querySelector(".map-grid"),
    tileSelector: World.querySelector(".tile-selector"),
    size: { width: 20, height: 20 }, // In tiles!!!
    resolution: 32, // pixels squared (ex: 32x32)

    onMouseUp: (e) => {
      const mousePos = fixedMousePosition(e);
      const tilePos = fixedToGrid(mousePos, Map.resolution);
      const tile = {
        x: tilePos.x / Map.resolution,
        y: tilePos.y / Map.resolution,
      };

      console.log({ mousePos, tilePos, tile });
    },
    onMouseMove: (e) => {
      const mousePos = fixedMousePosition(e);
      const tilePos = fixedToGrid(mousePos, Map.resolution);

      if (tilePos.x < 0 || tilePos.y < 0) return;
      Map.tileSelector.style.left = `${tilePos.x}px`;

      if (
        tilePos.x > Map.size.width * Map.resolution - Map.resolution ||
        tilePos.y > Map.size.height * Map.resolution - Map.resolution
      )
        return;
      Map.tileSelector.style.top = `${tilePos.y}px`;
    },
  };

  function fixedMousePosition(e) {
    const mousePos = {
      x:
        e.clientX -
        e.currentTarget.parentNode.offsetLeft +
        e.currentTarget.parentNode.scrollLeft,
      y:
        e.clientY -
        e.currentTarget.parentNode.offsetTop +
        e.currentTarget.parentNode.scrollTop,
    };
    return mousePos;
  }

  function showGrid() {
    const { width, height } = Map.size;
    const resolution = Map.resolution;
    const grid = Map.grid;
    const ctx = grid.getContext("2d");

    grid.width = width * resolution;
    grid.height = height * resolution;

    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1;

    for (let x = 0; x < width * resolution; x += resolution) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height * resolution);
      ctx.stroke();
    }

    for (let y = 0; y < height * resolution; y += resolution) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width * resolution, y);
      ctx.stroke();
    }

    grid.dataset.visible = "Y";
  }

  function hideGrid() {
    const grid = Map.grid;
    const ctx = grid.getContext("2d");
    ctx.clearRect(0, 0, grid.width, grid.height);

    grid.dataset.visible = "N";
  }

  function fixedToGrid(pos, gridSize) {
    const x = Math.floor(pos.x / gridSize) * gridSize;
    const y = Math.floor(pos.y / gridSize) * gridSize;
    return { x, y };
  }

  function resizeMap(width, height, res) {
    Map.element.style.width = `${width * res}px`;
    Map.element.style.height = `${height * res}px`;

    Map.grid.style.width = `${width * res}px`;
    Map.grid.style.height = `${height * res}px`;

    // Resize children
    const children = Map.element.querySelectorAll("div");
    children.forEach((child) => {
      child.style.width = `${width * res}px`;
      child.style.height = `${height * res}px`;
    });

    Map.size.width = width;
    Map.size.height = height;
    Map.resolution = res;

    Map.tileSelector.style.width = `${res}px`;
    Map.tileSelector.style.height = `${res}px`;

    hideGrid();
  }

  function toolsHandler(e) {
    const target = e.target;
    const tool = target.name;

    switch (tool) {
      case "btnMapDimensions": {
        const dlg = document.querySelector("#dlgMapDimensions");
        dlg.showModal();

        dlg.addEventListener("click", (e) => {
          const target = e.target;
          const action = target.name;

          if (action === "btnOk") {
            const width = parseInt(
              dlg.querySelector('[name="txtMapWidth"]').value
            );
            const height = parseInt(
              dlg.querySelector('[name="txtMapHeight"]').value
            );
            const res = parseInt(
              dlg.querySelector('[name="txtTileSize"]').value
            );

            resizeMap(width, height, res);
            dlg.close();
          }

          if (action === "btnCancel") {
            dlg.close();
          }
        });

        break;
      }
      case "btnAtlasImporter":
        break;
      case "btnSpriteCreator":
        break;
      case "btnToggleGrid":
        if (Map.grid.dataset.visible === "Y") hideGrid();
        else showGrid();
        break;
      default:
        console.log(tool);
        break;
    }
  }

  // Init
  resizeMap(Map.size.width, Map.size.height, Map.resolution);

  // Map events
  Map.element.addEventListener("contextmenu", (e) => e.preventDefault());
  Map.element.addEventListener("mouseup", Map.onMouseUp);
  Map.element.addEventListener("mousemove", Map.onMouseMove);

  // Events
  const $tools = document.querySelector(".tools");
  $tools.addEventListener("click", toolsHandler);
})();
