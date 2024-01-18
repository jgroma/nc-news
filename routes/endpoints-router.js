const { getEndpoints } = require("../controllers/endpoints.controllers");

const endpointRouter = require("express").Router();

endpointRouter.get("/", getEndpoints);

module.exports = endpointRouter;

//app.get("/api", getEndpoints); //done
