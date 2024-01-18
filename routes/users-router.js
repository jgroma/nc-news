const { getUsers } = require("../controllers/users.controllers");

const userRouter = require("express").Router();

userRouter.get("/", getUsers);

module.exports = userRouter;

//app.get("/api/users", getUsers); //done
