const fs = require("fs");
const jwt = require("jsonwebtoken");

const { pool } = require("../../src/db/db");

/**
 * Precondition: database is empty
 */
async function createDatabaseFromSchema() {
  await pool.query(
    fs.readFileSync(__dirname + "/../../src/schema/schema.sql", "utf-8")
  );
}

async function eraseDatabase() {
  await pool.query(
    fs.readFileSync(__dirname + "/../../src/schema/erase.sql", "utf-8")
  );
}

/**
 * Warning: must be the last thing to do in the process
 */
async function disconnectDatabase() {
  pool.end();
}

/**
 *
 * @param {number} user_id
 */
function generateAuthorizationHeaderForUser(user_id) {
  // use jwt library to make a jwt with payload {id: user_id}
  const token = jwt.sign({ id: user_id }, process.env.JWT_SECRET || "");
  // return the Authorization header with the token
  return `Bearer ${token}`;
}

module.exports = {
  createDatabaseFromSchema,
  eraseDatabase,
  disconnectDatabase,
  generateAuthorizationHeaderForUser,
};
