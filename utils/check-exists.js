const db = require("../db/connection");

exports.checkArticleExists = (article_id) => {
  return db
    .query(
      `
    SELECT * FROM articles
    WHERE article_id = $1
    `,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "Article does not exist",
        });
      }
      //else do nothing (article exists)
    });
};

exports.checkTopicExists = (topic) => {
  return db
    .query(
      `
    SELECT * FROM topics
    WHERE slug = $1
  `,
      [topic]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "Topic does not exist" });
      }
      //else do nothing (topic exists)
    });
};

exports.checkCommentExists = (comment_id) => {
  return db
    .query(
      `
    SELECT * FROM comments
    WHERE comment_id = $1
    `,
      [comment_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "Comment does not exist",
        });
      }
    });
};

exports.checkUserExists = (username) => {
  return db
    .query(
      `
    SELECT * FROM users
    WHERE username = $1
    `,
      [username]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "User does not exist",
        });
      }
    });
};
