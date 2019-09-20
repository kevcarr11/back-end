const express = require("express");

const server = express();

server.get("/api/hello", (_req, res) => {
  res.json({
    message: "World"
  });
});

module.exports = server;
