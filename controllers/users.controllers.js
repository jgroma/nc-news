const { fetchUsers } = require("../models/users.models");

exports.getUsers = (req, res, next) => {
  fetchUsers().then((users) => {
    console.log(users, "users");
    res.status(200).send({ users });
  });
};
