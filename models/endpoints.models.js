const endpointData = require("../endpoints.json");
exports.fetchEndpoints = () => {
  //console.log(endpointData, "endpoint json in model");
  return endpointData;
};
