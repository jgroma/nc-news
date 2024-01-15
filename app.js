const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const {
  invalidPathHandler,
  serverErrorHandler,
} = require("./controllers/errors.controllers");
const { getEndpoints } = require("./controllers/endpoints.controllers");
//require controllers
//require error handlers
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

//handle any invalid path
app.all("*", invalidPathHandler);

app.use(serverErrorHandler);

module.exports = app;
