//const { res } = require("../app");
const { selectTopics } = require("../models/topics.models");

exports.getTopics = (req, res, next) => {
  //console.log("hi, controller here");
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};
