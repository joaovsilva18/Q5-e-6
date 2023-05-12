const { pool } = require("../db/db"); // Assuming you have set up a PostgreSQL connection pool

/**
 * Retrieve all order items.
 * @param {PGClient} [client] - Optional PGClient instance. Defaults to pool.
 * @returns {Promise<Array<OrderItem>>} - A Promise resolving to an array of order item objects.
 */
async function getAllOrderItems(client = pool) {
  try {
    const result = await client.query("SELECT * FROM orderitems");
    return result.rows;
  } catch (error) {
    console.error(`getAllOrderItems Error: ${error}`);
    throw error;
  }
}

/**
 * Get all order items for a specific order.
 * @param {number} order_id - The ID of the order to retrieve the order items for.
 * @param {PGClient} [client] - Optional PGClient instance. Defaults to pool.
 * @returns {Promise<Array<OrderItem>>} - A Promise resolving to an array of order item objects.
 */
async function getOrderItemsByOrderId(order_id, client = pool) {
  try {
    const query = "SELECT * FROM orderitems WHERE order_id = $1";
    const values = [order_id];
    const result = await client.query(query, values);
    return result.rows;
  } catch (error) {
    console.error(`getOrderItemsByOrderId Error: ${error}`);
    throw error;
  }
}

/**
 * Get all order items for a specific order, joined with product information of the item.
 * @param {number} order_id - The ID of the order to retrieve the order items for.
 * @param {PGClient} [client] - Optional PGClient instance. Defaults to pool.
 * @returns {Promise<Array<OrderItemWithProductInformation>>} - A Promise
 * resolving to an array of order item objects with product information already
 * joined.
 */
async function getOrderItemsWithProductInformationByOrderId(
  order_id,
  client = pool
) {
  try {
    const query = `
    SELECT 
      OrderItems.order_id, 
      OrderItems.product_id, 
      OrderItems.quantity,
      Products.name AS product_name,
      Products.price AS product_price, 
      Products.category_id AS product_category_id
    FROM OrderItems
    JOIN Products ON OrderItems.product_id = Products.id
    WHERE OrderItems.order_id = $1;
    `;
    const values = [order_id];
    const result = await client.query(query, values);
    return result.rows;
  } catch (error) {
    console.error(`getOrderItemsByOrderId Error: ${error}`);
    throw error;
  }
}

/**
 * Create a new order item.
 * @param {number} order_id - The ID of the order associated with the order item.
 * @param {number} product_id - The ID of the product associated with the order item.
 * @param {number} quantity - The quantity of the product in the order item.
 * @param {PGClient} [client] - Optional PGClient instance. Defaults to pool.
 * @returns {Promise<OrderItem[]>} - A Promise resolving to an array of order item objects.
 */
async function createOrderItem(order_id, product_id, quantity, client = pool) {
  try {
    const query = `
      INSERT INTO orderitems (order_id, product_id, quantity)
      VALUES ($1, $2, $3) RETURNING *
    `;
    const values = [order_id, product_id, quantity];
    const result = await client.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error(`createOrderItem Error: ${error}`);
    throw error;
  }
}

/**
 * Update an existing order item.
 * @param {number} order_id - The ID of the order associated with the order item.
 * @param {number} product_id - The ID of the product associated with the order item.
 * @param {number} quantity - The updated quantity of the product in the order item.
 * @param {PGClient} [client] - Optional PGClient instance. Defaults to pool.
 * @returns {Promise<OrderItem>}
 */
async function updateOrderItem(order_id, product_id, quantity, client = pool) {
  try {
    const query = `
      UPDATE orderitems
      SET quantity = $3
      WHERE order_id = $1 AND product_id = $2
      RETURNING *
    `;
    const values = [order_id, product_id, quantity];
    await client.query(query, values);
    const result = await client.query(query, values);
    if (result.rows.length === 0) {
      throw new Error(
        `updateOrderItem Error: No order item found for order ${order_id} and product ${product_id}`
      );
    }
    return result.rows[0];
  } catch (error) {
    console.error(`updateOrderItem Error: ${error}`);
    throw error;
  }
}

/**
 * Delete an order item.
 * @param {number} order_id - The ID of the order associated with the order item.
 * @param {number} product_id - The ID of the product associated with the order item.
 * @param {PGClient} [client] - Optional PGClient instance. Defaults to pool.
 * @returns {Promise<void>}
 */
async function deleteOrderItem(order_id, product_id, client = pool) {
  try {
    const query =
      "DELETE FROM orderitems WHERE order_id = $1 AND product_id = $2";
    const values = [order_id, product_id];
    const result = await client.query(query, values);
    if (result.rowCount === 0) {
      throw new Error(
        `No order item found for order ${order_id} and product ${product_id}`
      );
    }
  } catch (error) {
    console.error(`deleteOrderItem Error: ${error}`);
    throw error;
  }
}

module.exports = {
  getAllOrderItems,
  getOrderItemsByOrderId,
  getOrderItemsWithProductInformationByOrderId,
  createOrderItem,
  updateOrderItem,
  deleteOrderItem,
};
