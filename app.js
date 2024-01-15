const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const {
  invalidPathHandler,
  serverErrorHandler,
} = require("./controllers/errors.controllers");
//require controllers
//require error handlers
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

//handle any invalid path
app.all("*", invalidPathHandler);

app.use(serverErrorHandler);

module.exports = app;
