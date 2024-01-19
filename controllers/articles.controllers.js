const {
  fetchArticleById,
  fetchArticles,
  fetchArticleComments,
  insertArticleComment,
  updateArticleById,
  insertArticle,
} = require("../models/articles.models");
const {
  checkArticleExists,
  checkTopicExists,
  checkUserExists,
} = require("../utils/check-exists");

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
  const { sort_by, order, topic, limit, p } = req.query;
  const fetchArticlesQuery = fetchArticles(sort_by, order, topic, limit, p);
  const limitlessArticleQuery = fetchArticles(
    sort_by,
    order,
    topic,
    18446744073709,
    1
  );
  const queries = [fetchArticlesQuery, limitlessArticleQuery];

  if (topic) {
    const topicExistenceQuery = checkTopicExists(topic);
    queries.push(topicExistenceQuery);
  }

  Promise.all(queries)
    .then((response) => {
      const articles = response[0];
      const total_count = response[1].length;

      res.status(200).send({ articles, total_count });
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

exports.postArticle = (req, res, next) => {
  const { author, title, body, topic, article_img_url } = req.body;

  const authorExistenceQuery = checkUserExists(author);
  const topicExistenceQuery = checkTopicExists(topic);

  const insertArticleQuery = insertArticle(
    author,
    title,
    body,
    topic,
    article_img_url
  );
  Promise.all([insertArticleQuery, authorExistenceQuery, topicExistenceQuery])
    .then((response) => {
      const article = response[0];
      res.status(201).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
