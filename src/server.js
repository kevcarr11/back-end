const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const authRouter = require("./routes/auth");
const categoriesRouter = require("./routes/categories");

const server = express();
server.use(helmet());
server.use(cors());
server.use(express.json());

server.use("/api/auth", authRouter);
server.use("/api/categories", categoriesRouter);

server.get("/api/hello", (_req, res) => {
  res.json({
    message: "World"
  });
});

module.exports = server;
