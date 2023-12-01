(() => {
  const Inspector = document.querySelector(".inspector");
  const Editor = document.querySelector(".editor");
  const World = Editor.querySelector(".world");

  const Map = {
    element: World.querySelector(".map"),
    tileSelector: World.querySelector(".tile-selector"),
    grid: World.querySelector(".map-grid"),
    name: "New Map",
    filename: null,
    thumbnail: null,
    unsaved: true,
    data: null,
    size: { width: 20, height: 20 }, // In tiles!!!
    resolution: 32, // pixels squared (ex: 32x32)

    onMouseUp: (e) => {
      const mousePos = fixedMousePosition(e);
      const tilePos = fixedToGrid(mousePos, Map.resolution);
      const tile = {
        x: tilePos.x / Map.resolution,
        y: tilePos.y / Map.resolution,
      };

      console.log({ mousePos, tilePos, tile, e });
    },
    onMouseMove: (e) => {
      const mousePos = fixedMousePosition(e);
      const tilePos = fixedToGrid(mousePos, Map.resolution);

      if (mousePos.x < 0 || mousePos.x > Map.size.width * Map.resolution - 5)
        return;
      Map.tileSelector.style.left = `${tilePos.x}px`;

      if (mousePos.y < 0 || mousePos.y > Map.size.width * Map.resolution - 5)
        return;
      Map.tileSelector.style.top = `${tilePos.y}px`;
    },
    Save() {
      const name = prompt("Enter a name for the map", Map.name);

      if (!name) return;

      const data = {
        name: name,
        size: Map.size,
        resolution: Map.resolution,
        data: Map.data,
      };

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      };

      fetch("http://localhost:3000/savemap", requestOptions)
        .catch((err) => {
          console.log(err);
          alert("Save failed, check console for details");
        })
        .then((response) => response.json())
        .then((data) => {
          Map.unsaved = false;
          Map.filename = data.file;
          Map.name = name;

          alert("Save complete");

          updatePageTitle();
        });
    },
    async GetList() {
      const requestOptions = {
        method: "GET",
      };

      const data = await fetch(
        "http://localhost:3000/listmaps",
        requestOptions
      );
      const list = await data.json();

      return list;
    },
    async Load() {
      const list = await Map.GetList();
      const dlg = document.querySelector("#dlgLoadMap");

      const renderList = (list) => {
        const listContainer = dlg.querySelector(".map-list");

        if (list.length === 0) {
          listContainer.innerHTML = `<div class="no-maps"><span>No maps found</span></div>`;
          return;
        }

        listContainer.innerHTML = "";
        list.forEach((map, i) => {
          map.id = i.toString();

          const item = document.createElement("div");

          item.classList.add("map-item");
          item.innerHTML = `<div class="thumbnail" style="background-image: url(${map.thumbnail})"></div><span>${map.name}</span><i class="mdi"></i>`;
          item.dataset.id = i;

          item.addEventListener("click", (e) => {
            const selected = listContainer.querySelector(".selected");

            if (selected) {
              selected.querySelector(".mdi").innerText = "";
              selected.classList.remove("selected");
            }

            e.currentTarget.classList.toggle("selected");
            e.currentTarget.querySelector(".mdi").innerText = "check";
          });

          listContainer.appendChild(item);
        });
      };

      const dlgButtonsClick = async (e) => {
        const target = e.target;
        const action = target.name;

        if (action === "btnOk") {
          const selected = dlg.querySelector(".map-list .selected");

          if (!selected) {
            alert("Select a map to load");
            return;
          }

          const map = list.find((m) => m.id === selected.dataset.id);

          if (!map) {
            alert("Select a map to load");
            return;
          }

          const requestOptions = {
            method: "GET",
          };

          const data = await fetch(
            `http://localhost:3000/loadmap?name=${map.name}`,
            requestOptions
          );
          const mapData = await data.json();

          Map.name = mapData.name;
          Map.size = mapData.size;
          Map.resolution = mapData.resolution;
          Map.data = mapData.data;
          Map.filename = mapData.filename;
          Map.thumbnail = mapData.thumbnail;
          Map.unsaved = false;

          resizeMap(Map.size.width, Map.size.height, Map.resolution);
          showGrid();
          updatePageTitle();

          alert("Map loaded successfully");

          dlg.close();
          dlg.removeEventListener("click", dlgButtonsClick);
        }

        if (action === "btnCancel") {
          dlg.close();
          dlg.removeEventListener("click", dlgButtonsClick);
        }
      };

      dlg.showModal();
      dlg.addEventListener("click", dlgButtonsClick);

      renderList(list);
    },
  };

  function fixedMousePosition(e) {
    const mousePos = {
      x:
        e.clientX -
        e.currentTarget.parentNode.offsetLeft +
        e.currentTarget.parentNode.scrollLeft -
        1,
      y:
        e.clientY -
        e.currentTarget.parentNode.offsetTop +
        e.currentTarget.parentNode.scrollTop -
        1,
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

    Map.tileSelector.style.width = `${res - 2}px`;
    Map.tileSelector.style.height = `${res - 2}px`;

    hideGrid();
  }

  function editorToolsHandler(e) {
    const target = e.target;
    const tool = target.name;

    switch (tool) {
      case "btnMapDimensions": {
        const dlg = document.querySelector("#dlgMapDimensions");
        const dlgButtonsClick = (e) => {
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
        };

        dlg.showModal();
        dlg.addEventListener("click", dlgButtonsClick);

        break;
      }

      case "btnToggleGrid":
        if (Map.grid.dataset.visible === "Y") hideGrid();
        else showGrid();
        break;

      case "btnSave":
        Map.Save();
        break;

      case "btnLoad":
        Map.Load();
        break;

      default:
        console.log(tool);
        break;
    }
  }

  function uploadAssets(files, type) {
    const formdata = new FormData();
    formdata.append("file", files[0]);
    formdata.append("assetType", "texture");

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    fetch("http://localhost:3000/upload", requestOptions)
      .catch((err) => {
        console.log(err);
        alert("Upload failed, check console for details");
      })
      .then((response) => response.text())
      .then((res) => {
        console.log(res);
        alert("Upload complete");
      });
  }

  function inspectorToolsHandler(e) {
    const target = e.target;
    const tool = target.name;

    switch (tool) {
      case "btnImportAsset": {
        const dlg = document.querySelector("#dlgImportAsset");
        const dlgButtonsClick = (e) => {
          const target = e.target;
          const action = target.name;

          if (action === "btnOk") {
            const files = dlg.querySelector('[name="file"]').files;
            const type = dlg.querySelector('[name="ddAssetType"]').value;

            uploadAssets(files, type);

            dlg.close();
          }

          if (action === "btnCancel") {
            dlg.close();
          }
        };

        dlg.showModal();
        dlg.addEventListener("click", dlgButtonsClick);

        break;
      }

      case "btnNewSprite":
        break;

      case "btnNewAnimation":
        break;

      case "btnNewEntity":
        break;

      default:
        console.log(tool);
        break;
    }
  }

  function updatePageTitle() {
    document.title = `Map Editor - ${Map.name}`;
    if (Map.unsaved) document.title += "*";
  }

  // Init
  resizeMap(Map.size.width, Map.size.height, Map.resolution);
  showGrid();
  updatePageTitle();

  // Map events
  Map.element.addEventListener("contextmenu", (e) => e.preventDefault());
  Map.element.addEventListener("mouseup", Map.onMouseUp);
  Map.element.addEventListener("mousemove", Map.onMouseMove);

  // Events
  Editor.querySelector(".tools").addEventListener("click", editorToolsHandler);
  Inspector.querySelector(".tools").addEventListener(
    "click",
    inspectorToolsHandler
  );
})();
