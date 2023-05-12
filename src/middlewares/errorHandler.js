const { errorNameToHttpStatusCode, createError } = require("../errors");

/**
 *
 * @param {unknown} err
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 * @param {ExpressNextFunction} next
 */
async function handleAllErrors(err, req, res, next) {
  // if not an application error, respond with internal server error
  if (
    typeof err !== "object" ||
    err === null ||
    !("name" in err) ||
    typeof err.name !== "string" ||
    !Object.keys(errorNameToHttpStatusCode).includes(err.name)
  ) {
    res.status(500).json({
      err: createError(
        "InternalServerError",
        `original error message is: ${err}`
      ),
      data: null,
    });
    return;
  }

  const httpStatusCode =
    errorNameToHttpStatusCode[
      /** @type {keyof typeof errorNameToHttpStatusCode} */ (err.name)
    ];

  res.status(httpStatusCode).json({
    err: err,
    data: null,
  });
}

module.exports = {
  handleAllErrors,
};
