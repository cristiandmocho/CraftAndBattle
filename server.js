import express from "express";
import multer from "multer";
import { mkdirSync, writeFileSync } from "node:fs";
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
        message: "success",
        file: join("web", "upload", filename).replace(/\\/g, "/"),
      });
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
