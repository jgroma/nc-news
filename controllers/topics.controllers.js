//const { res } = require("../app");
const { selectTopics, insertTopics } = require("../models/topics.models");
const { checkTopicExists } = require("../utils/check-exists");

exports.getTopics = (req, res, next) => {
  //console.log("hi, controller here");
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      console.log(err, "err");
      next(err);
    });
};

exports.postTopics = (req, res, next) => {
  console.log("hi in controller");
  const { slug, description } = req.body;

  insertTopics(slug, description)
    .then((topic) => {
      res.status(201).send({ topic });
    })
    .catch((err) => {
      next(err);
    });
};
