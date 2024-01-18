const { getTopics } = require("../controllers/topics.controllers");

const topicRouter = require("express").Router();

topicRouter.get("/", getTopics);

module.exports = topicRouter;

//pp.get("/api/topics", getTopics); //done
