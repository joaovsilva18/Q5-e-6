const { Pool } = require("pg");
const pgTypes = require("pg-types");

// convert DECIMAL and NUMERIC to number (otherwise it translates to a string in js)
pgTypes.setTypeParser(1700, (numberValue) => parseFloat(numberValue));

require("dotenv").config();

/**
 * A proxy to a pool object. Connects to the database
 * only when a method is called on the pool
 */
const pool = new Proxy(/** @type {Pool} */ ({}), {
  get(target, prop, receiver) {
    if (!actualPool) {
      actualPool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT),
      });
    }

    return Reflect.get(actualPool, prop, actualPool);
  },
});

/**
 * @type {null | Pool}
 */
let actualPool = null;

module.exports = { pool };
