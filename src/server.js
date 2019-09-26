const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const authRouter = require("./routes/auth");
const categoriesRouter = require("./routes/categories");
const restaurantsRouter = require("./routes/restaurants");
const usersRouter = require("./routes/users");

const server = express();
server.use(helmet());
server.use(cors());
server.use(express.json());

server.use("/api/auth", authRouter);
server.use("/api/categories", categoriesRouter);
server.use("/api/restaurants", restaurantsRouter);
server.use("/api/users", usersRouter);

server.get("/api/hello", (_req, res) => {
  res.json({
    message: "World"
  });
});

module.exports = server;
