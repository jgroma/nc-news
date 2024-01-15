exports.invalidPathHandler = (req, res) => {
  //console.log("hi invalid path");
  return res.status(404).send({ message: "Invalid path" });
};

exports.serverErrorHandler = (err, req, res, next) => {
  //console.log("hi server error");
  console.log(err);
  res.status(500).send({ message: "Server error" });
};

exports.customErrorHandler = (err, req, res, next) => {
  if (err.status && err.message) {
    return res.status(err.status).send({ message: err.message });
  } else {
    next(err);
  }
};

exports.psqlErrorHandler = (err, req, res, next) => {
  if ((err.code = "22P02")) {
    return res.status(400).send({ message: "Bad request" });
  } else {
    next(err);
  }
};
