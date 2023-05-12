const { pool } = require("../db/db"); // Assuming you have set up a PostgreSQL connection pool

/**
 * Retrieve all orders.
 * @param {PGClient} [client] - The client to use for the database connection (optional, defaults to pool).
 * @returns {Promise<Array<Order>>} - A Promise resolving to an array of order objects.
 */
async function getAllOrders(client = pool) {
  try {
    const result = await client.query("SELECT * FROM orders");
    return result.rows;
  } catch (error) {
    console.error("getAllOrders:", error);
    throw error;
  }
}

/**
 * Get a specific order by ID.
 * @param {number} id - The ID of the order to retrieve.
 * @param {PGClient} [client] - The client to use for the database connection (optional, defaults to pool).
 * @returns {Promise<Order|null>} - A Promise resolving to the order object, or null if not found.
 */
async function getOrderById(id, client = pool) {
  try {
    const query = "SELECT * FROM orders WHERE id = $1";
    const values = [id];
    const result = await client.query(query, values);
    return result.rows[0] || null;
  } catch (error) {
    console.error("getOrderById:", error);
    throw error;
  }
}

/**
 * Create a new order.
 * @param {number} user_id - The ID of the user associated with the order.
 * @param {boolean} confirmed - Indicates if the order is confirmed or not.
 * @param {PGClient} [client] - The client to use for the database connection (optional, defaults to pool).
 * @returns {Promise<Order>} - A Promise resolving to the created order object.
 */
async function createOrder(user_id, confirmed, client = pool) {
  try {
    const query = `
      INSERT INTO orders (user_id, confirmed)
      VALUES ($1, $2)
      RETURNING *
    `;
    const values = [user_id, confirmed];
    const result = await client.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("createOrder:", error);
    throw error;
  }
}

/**
 * Update an existing order.
 * @param {number} id - The ID of the order to update.
 * @param {boolean} confirmed - Indicates if the order is confirmed or not.
 * @param {PGClient} [client] - The client to use for the database connection (optional, defaults to pool).
 * @returns {Promise<Order>} - A Promise resolving to the updated order object, or null if not found.
 */
async function updateOrder(id, confirmed, client = pool) {
  try {
    const query = `
      UPDATE orders
      SET confirmed = $1
      WHERE id = $2
      RETURNING *
    `;
    const values = [confirmed, id];
    const result = await client.query(query, values);
    if (result.rowCount === 0) {
      throw new Error(`No order found with id ${id}`);
    }
    return result.rows[0];
  } catch (error) {
    console.error("updateOrder:", error);
    throw error;
  }
}

/**
 * Delete an order.
 * @param {number} id - The ID of the order to delete.
 * @param {PGClient} [client] - The client to use for the database connection (optional, defaults to pool).
 * @returns {Promise<void>}
 */
async function deleteOrder(id, client = pool) {
  try {
    const query = "DELETE FROM orders WHERE id = $1";
    const values = [id];
    const result = await client.query(query, values);
    if (result.rowCount === 0) {
      throw new Error(`No order found with id ${id}`);
    }
  } catch (error) {
    console.error("deleteOrder:", error);
    throw error;
  }
}

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
};
