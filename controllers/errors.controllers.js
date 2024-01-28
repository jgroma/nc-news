exports.invalidPathHandler = (req, res) => {
  return res.status(404).send({ message: "Invalid path" });
};

exports.serverErrorHandler = (err, req, res, next) => {
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
  if (
    err.code === "22P02" ||
    err.code === "23502" ||
    err.code === "23503" ||
    err.code === "23505"
  ) {
    return res.status(400).send({ message: "Bad request" });
  } else {
    next(err);
  }
};
