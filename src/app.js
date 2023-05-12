const express = require("express");
// @ts-expect-error: No declaration file
require("express-async-errors");

const cors = require("cors");
const { handleAllErrors } = require("./middlewares/errorHandler");

const app = express();

// basic middlewares
app.use(cors());
app.use(express.json());

// routes
app.use("/orders", require("./routers/orders"));

// error handler
app.use(handleAllErrors);

module.exports = {
  app,
};
