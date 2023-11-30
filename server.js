import express from "express";

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
