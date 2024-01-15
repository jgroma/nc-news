const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const {
  invalidPathHandler,
  serverErrorHandler,
  customErrorHandler,
  psqlErrorHandler,
} = require("./controllers/errors.controllers");
const { getEndpoints } = require("./controllers/endpoints.controllers");
const {
  getArticleById,
  getArticles,
} = require("./controllers/articles.controllers");
//require controllers
//require error handlers
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

//handle any invalid path
app.all("*", invalidPathHandler);

app.use(customErrorHandler);

app.use(psqlErrorHandler);

app.use(serverErrorHandler);

module.exports = app;
