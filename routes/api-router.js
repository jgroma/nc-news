const apiRouter = require("express").Router();
const articleRouter = require("./articles-router");
const commentRouter = require("./comments-router");
const endpointRouter = require("./endpoints-router");
const topicRouter = require("./topics-router");
const userRouter = require("./users-router");

apiRouter.use("/", endpointRouter);

apiRouter.use("/topics", topicRouter);

apiRouter.use("/users", userRouter);

apiRouter.use("/comments", commentRouter);

apiRouter.use("/articles", articleRouter);

module.exports = apiRouter;
