exports.invalidPathHandler = (req, res) => {
  //console.log("hi invalid path");
  return res.status(404).send({ message: "Invalid path" });
};

exports.serverErrorHandler = (err, req, res, next) => {
  //console.log("hi server error");
  console.log(err);
  res.status(500).send({ message: "Server error" });
};
