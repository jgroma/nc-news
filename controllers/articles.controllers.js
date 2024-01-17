const {
  fetchArticleById,
  fetchArticles,
  fetchArticleComments,
  insertArticleComment,
  updateArticleById,
} = require("../models/articles.models");
const { checkArticleExists } = require("../utils/check-exists");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  const { topic } = req.query;
  fetchArticles(topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleComments = (req, res, next) => {
  const { article_id } = req.params;

  const articleExistenceQuery = checkArticleExists(article_id);
  const fetchCommentsQuery = fetchArticleComments(article_id);

  Promise.all([fetchCommentsQuery, articleExistenceQuery])
    .then((response) => {
      const comments = response[0];
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postArticleCommment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  const articleExistenceQuery = checkArticleExists(article_id);
  const insertArticleCommentQuery = insertArticleComment(
    username,
    body,
    article_id
  );

  Promise.all([insertArticleCommentQuery, articleExistenceQuery])
    .then((response) => {
      const comment = response[0];
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  const articleExistenceQuery = checkArticleExists(article_id);
  const updateArticleByIdQuery = updateArticleById(article_id, inc_votes);

  Promise.all([updateArticleByIdQuery, articleExistenceQuery])
    .then((response) => {
      const article = response[0];
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
