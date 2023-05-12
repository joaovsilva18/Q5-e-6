const { pool } = require("../db/db"); // Assuming you have set up a PostgreSQL connection pool

/**
 *
 * @param {PGClient} [client]
 * @returns {Promise<DiscountCode[]>}
 */
async function getAllDiscountCodes(client = pool) {
  try {
    const result = await client.query("SELECT * FROM discountcodes");
    return result.rows;
  } catch (error) {
    console.error(`getAllDiscountCodes: ${error}`);
    throw error;
  }
}

/**
 *
 * @param {number} id
 * @param {PGClient} [client]
 * @returns {Promise<DiscountCode | null>}
 */
async function getDiscountCodeById(id, client = pool) {
  try {
    const query = "SELECT * FROM discountcodes WHERE id = $1";
    const values = [id];
    const result = await client.query(query, values);
    return result.rows[0] || null;
  } catch (error) {
    console.error(`getDiscountCodeById: ${error}`);
    throw error;
  }
}

/**
 *
 * @param {string} code
 * @param {PGClient} [client]
 * @returns {Promise<DiscountCode | null>}
 */
async function getDiscountCodeByCode(code, client = pool) {
  try {
    const query = "SELECT * FROM discountcodes WHERE code = $1";
    const values = [code];
    const result = await client.query(query, values);
    return result.rows[0] || null;
  } catch (error) {
    console.error(`getDiscountCodeById: ${error}`);
    throw error;
  }
}

/**
 *
 * @param {string} code
 * @param {string} type
 * @param {number} value
 * @param {Date | string} expirationDate
 * @param {number | null} minimumOrderValue
 * @param {PGClient} [client]
 * @returns {Promise<DiscountCode>}
 */
async function createDiscountCode(
  code,
  type,
  value,
  expirationDate,
  minimumOrderValue,
  client = pool
) {
  try {
    const query =
      "INSERT INTO discountcodes (code, type, value, expiration_date, minimum_order_value) VALUES ($1, $2, $3, $4, $5) RETURNING *";
    const values = [code, type, value, expirationDate, minimumOrderValue];
    const result = await client.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error(`createDiscountCode: ${error}`);
    throw error;
  }
}

/**
 *
 * @param {number} id
 * @param {string} code
 * @param {number} value
 * @param {string} type
 * @param {Date | string} expirationDate
 * @param {number | null} minimumOrderValue
 * @param {PGClient} [client]
 * @returns {Promise<DiscountCode>}
 */
async function updateDiscountCode(
  id,
  code,
  value,
  type,
  expirationDate,
  minimumOrderValue,
  client = pool
) {
  try {
    const query =
      "UPDATE discountcodes SET code = $1, type = $2, value = $3, expiration_date = $4, minimum_order_value = $5 WHERE id = $6 RETURNING *";
    const values = [code, type, value, expirationDate, minimumOrderValue, id];
    const result = await client.query(query, values);
    if (result.rows.length === 0) {
      throw new Error(
        `updateDiscountCode: No discount code found with id ${id}`
      );
    }
    return result.rows[0];
  } catch (error) {
    console.error(`updateDiscountCode: ${error}`);
    throw error;
  }
}

/**
 *
 * @param {number} id
 * @param {PGClient} [client]
 */
async function deleteDiscountCode(id, client = pool) {
  try {
    const query = "DELETE FROM discountcodes WHERE id = $1";
    const values = [id];
    const result = await client.query(query, values);
    if (result.rowCount === 0) {
      throw new Error(
        `deleteDiscountCode: No discount code found with id ${id}`
      );
    }
  } catch (error) {
    console.error(`deleteDiscountCode: ${error}`);
    throw error;
  }
}

module.exports = {
  getAllDiscountCodes,
  getDiscountCodeById,
  getDiscountCodeByCode,
  createDiscountCode,
  updateDiscountCode,
  deleteDiscountCode,
};
