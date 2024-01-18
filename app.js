const express = require("express");
// const { getTopics } = require("./controllers/topics.controllers");
const {
  invalidPathHandler,
  serverErrorHandler,
  customErrorHandler,
  psqlErrorHandler,
} = require("./controllers/errors.controllers");
// const { getEndpoints } = require("./controllers/endpoints.controllers");
// const {
//   getArticleById,
//   getArticles,
//   getArticleComments,
//   postArticleCommment,
//   patchArticleById,
// } = require("./controllers/articles.controllers");
// const { deleteCommentById } = require("./controllers/comments.controllers");
// const { getUsers } = require("./controllers/users.controllers");
const apiRouter = require("./routes/api-router");
//require controllers
//require error handlers
const app = express();

app.use(express.json());

app.use("/api", apiRouter);

// app.get("/api/topics", getTopics); //done

// app.get("/api", getEndpoints);

// app.get("/api/articles/:article_id", getArticleById); //articles

// app.get("/api/articles", getArticles); //articles

// app.get("/api/articles/:article_id/comments", getArticleComments);

// app.post("/api/articles/:article_id/comments", postArticleCommment);

// app.patch("/api/articles/:article_id", patchArticleById); //articles

// app.delete("/api/comments/:comment_id", deleteCommentById); //done

// app.get("/api/users", getUsers); //done

//handle any invalid path
app.all("*", invalidPathHandler);

app.use(customErrorHandler);

app.use(psqlErrorHandler);

app.use(serverErrorHandler);

module.exports = app;

//Planning Routers
//api router for all /api paths
//endpoints (/api) (maybe leave that one since it's just one)
//topics
//app.use(/topics, topicRouter)
//articles
//app.use(/articles)
// /articles
// /articles/article_id (end of path)
//comments
// /comments
// /articles/article_id/comments ?? (or in articles??)
//users
// /users
