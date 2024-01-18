const db = require("../db/connection");

exports.removeCommentById = (comment_id) => {
  return db
    .query(
      `
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING * ;
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

exports.updateCommentById = (comment_id, newVotes) => {
  return db
    .query(
      `
  UPDATE comments
  SET votes = votes + $2
  WHERE comment_id = $1
  RETURNING *
  `,
      [comment_id, newVotes]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
