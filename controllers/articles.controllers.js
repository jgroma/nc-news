const {
  fetchArticleById,
  fetchArticles,
  fetchArticleComments,
  insertArticleComment,
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
  fetchArticles()
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
  console.log("gets in the controller??");
  //insertArticleComment();
  const { article_id } = req.params;
  const { username, body } = req.body;
  console.log(req.body, "req.body in cont");
  insertArticleComment(username, body, article_id)
    .then((comment) => {
      console.log(comment, "comment after model inv");
      res.status(201).send({ comment });
    })
    .catch((err) => {
      console.log(err, "err in controller"); //code "42601" syntax error

      next(err);
    });
};

//code: '23502',
//detail: 'Failing row contains (19, null, null, null, 0, 2024-01-16 12:05:52.158637).'
