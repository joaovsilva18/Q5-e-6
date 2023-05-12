const { pool } = require("../db/db");

/**
 * Adds a discount code to an order.
 * @param {number} order_id - The ID of the order.
 * @param {number} discount_code_id - The ID of the discount code.
 * @param {PGClient} [client] - Optional PGClient object. Defaults to `pool`.
 * @returns {Promise<void>} - A Promise that resolves when the operation is complete.
 */
async function addDiscountCodeToOrder(
  order_id,
  discount_code_id,
  client = pool
) {
  try {
    const query =
      "INSERT INTO OrderDiscounts (order_id, discount_code_id) VALUES ($1, $2)";
    const values = [order_id, discount_code_id];
    await client.query(query, values);
  } catch (error) {
    console.error("addDiscountCodeToOrder:", error);
    throw error;
  }
}

/**
 * Removes a discount code from an order.
 * @param {number} order_id - The ID of the order.
 * @param {number} discount_code_id - The ID of the discount code.
 * @param {PGClient} [client] - Optional PGClient object. Defaults to `pool`.
 * @returns {Promise<void>} - A Promise that resolves when the operation is complete.
 */
async function removeDiscountCodeFromOrder(
  order_id,
  discount_code_id,
  client = pool
) {
  try {
    const query =
      "DELETE FROM OrderDiscounts WHERE order_id = $1 AND discount_code_id = $2";
    const values = [order_id, discount_code_id];
    const result = await client.query(query, values);
    if (result.rowCount === 0) {
      throw new Error(
        `Discount code ${discount_code_id} not found for order ${order_id}`
      );
    }
  } catch (error) {
    console.error("removeDiscountCodeFromOrder:", error);
    throw error;
  }
}

/**
 * Retrieves all discount codes applied to a specific order.
 * @param {number} order_id - The ID of the order.
 * @param {PGClient} [client] - Optional PGClient object. Defaults to `pool`.
 * @returns {Promise<DiscountCode[]>} - A Promise that resolves with an array of DiscountCode records.
 */
async function getOrderDiscountCodesByOrderId(order_id, client = pool) {
  try {
    const query = `
        SELECT dc.id, dc.code, dc.value, dc.type, dc.expiration_date, dc.minimum_order_value
        FROM OrderDiscounts AS od
        JOIN DiscountCodes AS dc ON od.discount_code_id = dc.id
        WHERE od.order_id = $1
      `;
    const values = [order_id];
    const result = await client.query(query, values);
    return result.rows;
  } catch (error) {
    console.error("getOrderDiscountCodesByOrderId:", error);
    throw error;
  }
}

/**
 * Retrieves all discount codes applied to all orders of the user
 * @param {number} user_id - The ID of the user.
 * @param {PGClient} [client] - Optional PGClient object. Defaults to `pool`.
 * @returns {Promise<DiscountCode[]>} - A Promise that resolves with an array of DiscountCode records.
 */
async function getOrderDiscountCodesByUserId(user_id, client = pool) {
  try {
    const query = `
        SELECT dc.id, dc.code, dc.value, dc.type, dc.expiration_date, dc.minimum_order_value
        FROM Orders AS o
        JOIN OrderDiscounts AS od ON o.id = od.order_id
        JOIN DiscountCodes AS dc ON od.discount_code_id = dc.id
        WHERE o.user_id = $1
      `;
    const values = [user_id];
    const result = await client.query(query, values);
    return result.rows;
  } catch (error) {
    console.error("getDiscountCodesByUser:", error);
    throw error;
  }
}

// Export the functions for use in other modules
module.exports = {
  addDiscountCodeToOrder,
  removeDiscountCodeFromOrder,
  getOrderDiscountCodesByOrderId,
  getOrderDiscountCodesByUserId,
};
