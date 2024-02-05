const express = require("express");
const cors = require("cors");

const {
  invalidPathHandler,
  serverErrorHandler,
  customErrorHandler,
  psqlErrorHandler,
} = require("./controllers/errors.controllers");
const apiRouter = require("./routes/api-router");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

//handle any invalid path
app.all("*", invalidPathHandler);

app.use(customErrorHandler);

app.use(psqlErrorHandler);

app.use(serverErrorHandler);

module.exports = app;
