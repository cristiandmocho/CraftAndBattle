import express from "express";
import multer from "multer";
import cors from "cors";
import helmet from "helmet";

import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { resolve, join } from "node:path";

class Server {
  constructor() {
    this.server = express();

    this.settings();
    this.middlewares();
    this.routes();

    this.port = 3000;
  }

  async settings() {}

  middlewares() {
    this.server.use(express.json({ limit: process.env.MAX_FILE_SIZE }));
    this.server.use(
      express.urlencoded({ extended: false, limit: process.env.MAX_FILE_SIZE })
    );

    this.server.use(
      helmet({
        contentSecurityPolicy: false,
      })
    );

    this.server.use(
      cors({
        origin: "*",
      })
    );
  }

  routes() {
    this.server.use(express.static("web"));

    // Upload files
    const storage = multer.memoryStorage();
    const upload = multer({ storage: storage });

    this.server.post("/upload", upload.single("file"), (req, res) => {
      // Makes sure the "upload" folder exists
      const destFolder = resolve(join("web", "upload"));

      mkdirSync(destFolder, { recursive: true });

      // Writes the file to disk
      const filename = req.file.originalname;
      const filepath = join(destFolder, filename);

      writeFileSync(filepath, req.file.buffer);

      res.json({
        file: join("web", "upload", filename).replace(/\\/g, "/"),
      });
    });

    // Saving maps
    this.server.post("/savemap", (req, res) => {
      const { name, size, resolution, data } = req.body;
      const { width, height } = size;

      const destFolder = resolve(
        join("web", "maps", `${name.trim().toLowerCase().replace(/\s/g, "_")}`)
      );
      const destPath = join(destFolder, `${name}.map.json`);

      // Makes sure the destination folder exists
      mkdirSync(destFolder, { recursive: true });

      // Prepare the map data to save
      const mapData = JSON.stringify({
        name,
        size: { width, height },
        resolution,
        data,
      });

      // Writes the map data to disk
      writeFileSync(destPath, mapData);

      res.json({
        file: destPath.replace(/\\/g, "/"),
      });

      // Not finished yet! Creates the "assets" folder for the map
      mkdirSync(join(destFolder, "assets", "textures"), { recursive: true });
      mkdirSync(join(destFolder, "assets", "audio"), { recursive: true });
      mkdirSync(join(destFolder, "assets", "animations"), { recursive: true });

      // Saves thumbnail
      if (!req.body.thumbnail) return;

      const thumbnail = req.body.thumbnail.replace(
        /^data:image\/png;base64,/,
        ""
      );
      const thumbnailPath = join(destFolder, "thumbnail.png");

      writeFileSync(thumbnailPath, thumbnail, "base64");
    });

    // Loading maps
    this.server.get("/loadmap", (req, res) => {
      const { name } = req.query;

      const destFolder = resolve(
        join("web", "maps", `${name.trim().toLowerCase().replace(/\s/g, "_")}`)
      );
      const destPath = join(destFolder, `${name}.map.json`);

      // Makes sure the file exists
      if (!existsSync(destPath)) {
        res.status(404).json({ error: `Map ${name} not found` });
        return;
      }

      // Reads the map data from disk
      const mapData = JSON.parse(readFileSync(destPath));

      res.json(mapData);
    });

    // Listing maps
    this.server.get("/listmaps", (req, res) => {
      const destFolder = resolve(join("web", "maps"));
      const maps = [];

      // Makes sure the folder exists
      if (!existsSync(destFolder)) {
        res.status(404).json({ error: `No maps folder found` });
        return;
      }

      // Reads the map data from disk
      const dirs = readdirSync(destFolder, { withFileTypes: true });

      dirs.forEach((dir) => {
        if (!dir.isDirectory()) return;

        const files = readdirSync(join(dir.path, dir.name), {
          withFileTypes: true,
        });
        const destPath = join(
          destFolder,
          dir.name,
          files.find((f) => f.name.endsWith(".map.json")).name
        );
        const mapData = JSON.parse(readFileSync(destPath));

        const data = {
          filename: destPath,
          name: mapData.name,
          thumbnail: join("maps", dir.name, "thumbnail.png").replace(
            /\\/g,
            "/"
          ),
        };

        maps.push(data);
      });

      res.json(maps);
    });
  }

  start() {
    this.server.listen(this.port, () => {
      console.log("Server is up! Select one of the main pages:");
      console.log(`- http://localhost:${this.port}/mapeditor.html`);
      console.log(`- http://localhost:${this.port}/uieditor.html`);
      console.log(`- http://localhost:${this.port}/enginetests.html`);
    });
  }
}

const server = new Server();
server.start();
