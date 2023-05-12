const { pool } = require("../db/db"); // Assuming you have set up a PostgreSQL connection pool

/**
 * Retrieve all applicable categories for a discount code.
 * @param {number} discount_code_id - The ID of the discount code.
 * @param {PGClient} [client] - Optional PostgreSQL client.
 * @returns {Promise<Array<Category>>} - A Promise resolving to an array of applicable category objects.
 */
async function getApplicableCategoriesByDiscountCodeId(
  discount_code_id,
  client = pool
) {
  try {
    const query = `
      SELECT c.id, c.name
      FROM applicablecategories ac
      JOIN categories c ON ac.category_id = c.id
      WHERE ac.discount_code_id = $1
    `;
    const values = [discount_code_id];
    const result = await client.query(query, values);
    return result.rows;
  } catch (error) {
    console.error(`getApplicableCategoriesByDiscountCodeId: ${error}`);
    throw error;
  }
}

/**
 * Associate a category with a discount code.
 * @param {number} discount_code_id - The ID of the discount code.
 * @param {number} category_id - The ID of the category to associate.
 * @param {PGClient} [client] - Optional PostgreSQL client.
 * @returns {Promise<void>}
 */
async function addApplicableCategory(
  discount_code_id,
  category_id,
  client = pool
) {
  try {
    const query =
      "INSERT INTO applicablecategories (discount_code_id, category_id) VALUES ($1, $2)";
    const values = [discount_code_id, category_id];
    await client.query(query, values);
  } catch (error) {
    console.error(`addApplicableCategory: ${error}`);
    throw error;
  }
}

/**
 * Remove an association between a category and a discount code.
 * @param {number} discount_code_id - The ID of the discount code.
 * @param {number} category_id - The ID of the category to remove.
 * @param {PGClient} [client] - Optional PostgreSQL client.
 * @returns {Promise<void>}
 */
async function removeApplicableCategory(
  discount_code_id,
  category_id,
  client = pool
) {
  try {
    const query =
      "DELETE FROM applicablecategories WHERE discount_code_id = $1 AND category_id = $2";
    const values = [discount_code_id, category_id];
    const result = await client.query(query, values);
    if (result.rowCount === 0) {
      throw new Error(
        `Discount code ${discount_code_id} was already not applicable to category ${category_id}`
      );
    }
  } catch (error) {
    console.error(`removeApplicableCategory: ${error}`);
    throw error;
  }
}

module.exports = {
  getApplicableCategoriesByDiscountCodeId,
  addApplicableCategory,
  removeApplicableCategory,
};
