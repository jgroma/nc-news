const {
  deleteCommentById,
  patchCommentById,
} = require("../controllers/comments.controllers");

const commentRouter = require("express").Router();

commentRouter
  .route("/:comment_id")
  .delete(deleteCommentById)
  .patch(patchCommentById);

//commentRouter.delete("/:comment_id", deleteCommentById);

module.exports = commentRouter;
