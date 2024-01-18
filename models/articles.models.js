const db = require("../db/connection");

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `SELECT articles.*, CAST(COUNT(comment_id) AS INTEGER) AS comment_count 
      FROM articles 
      LEFT JOIN comments ON articles.article_id = comments.article_id 
      WHERE articles.article_id = $1
      GROUP BY articles.article_id;`,
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

exports.fetchArticles = (sort_by = "created_at", order = "desc", topic) => {
  const queryParameters = [];
  const validSortQueries = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];

  const validOrderQueries = ["asc", "desc"];

  if (!validSortQueries.includes(sort_by)) {
    return Promise.reject({ status: 400, message: "Invalid sort_by query" });
  }

  if (!validOrderQueries.includes(order)) {
    return Promise.reject({ status: 400, message: "Invalid order query" });
  }

  let queryStr = `SELECT articles.article_id, title, topic, articles.author, articles.created_at, articles.votes, article_img_url,CAST(COUNT(comment_id) AS INTEGER) AS comment_count FROM articles 
  LEFT JOIN comments ON articles.article_id = comments.article_id`;

  if (topic) {
    queryStr += ` WHERE topic = $1`;
    queryParameters.push(topic);
  }

  queryStr += ` GROUP BY articles.article_id
  ORDER BY articles.${sort_by} ${order.toUpperCase()};`;

  return db.query(queryStr, queryParameters).then(({ rows }) => {
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

exports.insertArticleComment = (username, body, article_id) => {
  return db
    .query(
      `
  INSERT INTO comments
  (author, body, article_id)
  VALUES 
  ($1, $2, $3) 
  RETURNING *;
  `,
      [username, body, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updateArticleById = (article_id, newVotes) => {
  return db
    .query(
      `
  UPDATE articles
  SET votes = votes + $2
  WHERE article_id = $1
  RETURNING *;
  `,
      [article_id, newVotes]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.insertArticle = (
  author,
  title,
  body,
  topic,
  article_img_url = "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700"
) => {
  //console.log("in model");
  return db
    .query(
      `
    INSERT INTO articles
    (author, title, body, topic, article_img_url)
    VALUES
    ($1, $2, $3, $4, $5)
    RETURNING *;
  `,
      [author, title, body, topic, article_img_url]
    )
    .then(({ rows }) => {
      console.log(rows, "rows before 2nd query");
      const insertedArticle = rows[0];
      const { article_id } = insertedArticle;

      return db.query(
        `SELECT articles.*, CAST(COUNT(comment_id) AS INTEGER) AS comment_count 
        FROM articles 
        LEFT JOIN comments ON articles.article_id = comments.article_id 
        WHERE articles.article_id = $1
        GROUP BY articles.article_id;`,
        [article_id]
      );
    })
    .then(({ rows }) => {
      return rows[0];
    });
};
