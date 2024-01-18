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

// app.get("/api/articles/:article_id", getArticleById); //done

// app.get("/api/articles", getArticles);  //done

// app.get("/api/articles/:article_id/comments", getArticleComments); //done

// app.post("/api/articles/:article_id/comments", postArticleCommment); //done

// app.patch("/api/articles/:article_id", patchArticleById); //done
