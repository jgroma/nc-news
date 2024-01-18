const {
  getUsers,
  getUserByUsername,
} = require("../controllers/users.controllers");

const userRouter = require("express").Router();

userRouter.route("/").get(getUsers);

userRouter.route("/:username").get(getUserByUsername);

module.exports = userRouter;
