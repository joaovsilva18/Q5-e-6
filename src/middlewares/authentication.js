const jwt = require("jsonwebtoken");
const { createError } = require("../errors");

require("dotenv").config();

/**
 *
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 * @param {ExpressNextFunction} next
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      err: createError("UnauthorizedError", "token is missing or invalid"),
      data: null,
    });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      err: createError("UnauthorizedError", "token is missing or invalid"),
      data: null,
    });
  }

  try {
    // FIXME: ugly double typecast: `decoded as unknown as {id: number}`
    const decoded = /** @type {{id: number}}*/ (
      /** @type {unknown}*/ (jwt.verify(token, process.env.JWT_SECRET || ""))
    );
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      err: createError("UnauthorizedError", "token is missing or invalid"),
      data: null,
    });
  }
}

module.exports = {
  authenticate,
};
