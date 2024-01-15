const { fetchEndpoints } = require("../models/endpoints.models");

exports.getEndpoints = (req, res) => {
  res.status(200).send({ endpoints: fetchEndpoints() });
};
