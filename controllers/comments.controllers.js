const {
  removeCommentById,
  updateCommentById,
} = require("../models/comments.models");
const { checkCommentExists } = require("../utils/check-exists");

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  removeCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  const commentExistenceQuery = checkCommentExists(comment_id);
  const updateCommentByIdQuery = updateCommentById(comment_id, inc_votes);

  Promise.all([updateCommentByIdQuery, commentExistenceQuery])
    .then((response) => {
      const comment = response[0];
      res.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
