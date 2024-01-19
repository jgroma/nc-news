const {
  getArticles,
  getArticleComments,
  postArticleCommment,
  getArticleById,
  patchArticleById,
  postArticle,
  deleteArticle,
} = require("../controllers/articles.controllers");

const articleRouter = require("express").Router();

articleRouter.route("/").get(getArticles).post(postArticle);

articleRouter
  .route("/:article_id/comments")
  .get(getArticleComments)
  .post(postArticleCommment);

articleRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById)
  .delete(deleteArticle);

module.exports = articleRouter;
