const {
  getArticles,
  getArticleComments,
  postArticleCommment,
  getArticleById,
  patchArticleById,
} = require("../controllers/articles.controllers");

const articleRouter = require("express").Router();

articleRouter.route("/").get(getArticles);

articleRouter
  .route("/:article_id/comments")
  .get(getArticleComments)
  .post(postArticleCommment);

articleRouter.route("/:article_id").get(getArticleById).patch(patchArticleById);

module.exports = articleRouter;
