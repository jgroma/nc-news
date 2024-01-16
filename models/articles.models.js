const db = require("../db/connection");

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `SELECT * FROM articles
        WHERE article_id = $1`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "Article does not exist",
        });
      }
      return rows[0];
    });
};

exports.fetchArticles = () => {
  return db
    .query(
      `
  SELECT articles.article_id, title, topic, articles.author, articles.created_at, articles.votes, article_img_url,CAST(COUNT(comment_id) AS INTEGER) AS comment_count FROM articles 
  LEFT JOIN comments ON articles.article_id = comments.article_id 
  GROUP BY articles.article_id
  ORDER BY articles.created_at DESC;`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.fetchArticleComments = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments
  WHERE article_id = $1
  ORDER BY created_at DESC;`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};
