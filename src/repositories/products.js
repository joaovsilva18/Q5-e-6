const { pool } = require("../db/db"); // Assuming you have set up a PostgreSQL connection pool

/**
 * Retrieve all products.
 * @param {PGClient} [client=pool] - The PostgreSQL client to use. Defaults to the pool.
 * @returns {Promise<Array<Product>>} - A Promise resolving to an array of product objects.
 */
async function getAllProducts(client = pool) {
  try {
    const result = await client.query("SELECT * FROM products");
    return result.rows;
  } catch (error) {
    console.error("getAllProducts error:", error);
    throw error;
  }
}

/**
 * Get a specific product by ID.
 * @param {number} id - The ID of the product to retrieve.
 * @param {PGClient} [client] - The PostgreSQL client to use. Defaults to the pool.
 * @returns {Promise<Product|null>} - A Promise resolving to the product object, or null if not found.
 */
async function getProductById(id, client = pool) {
  try {
    const query = "SELECT * FROM products WHERE id = $1";
    const values = [id];
    const result = await client.query(query, values);
    return result.rows[0] || null;
  } catch (error) {
    console.error("getProductById error:", error);
    throw error;
  }
}

/**
 * Create a new product.
 * @param {string} name - The name of the product.
 * @param {number} price - The price of the product.
 * @param {number} category_id
 * @param {PGClient} [client] - The PostgreSQL client to use. Defaults to the pool.
 * @returns {Promise<Product>} - A Promise resolving to the created product object.
 */
async function createProduct(name, price, category_id, client = pool) {
  try {
    const query =
      "INSERT INTO products (name, price, category_id) VALUES ($1, $2, $3) RETURNING *";
    const values = [name, price, category_id];
    const result = await client.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("createProduct error:", error);
    throw error;
  }
}

/**
 * Update an existing product.
 * @param {number} id - The ID of the product to update.
 * @param {string} name - The updated name of the product.
 * @param {number} price - The updated price of the product.
 * @param {number} category_id
 * @param {PGClient} [client] - The PostgreSQL client to use. Defaults to the pool.
 * @returns {Promise<Product>} - A Promise resolving to the updated product object, or null if not found.
 */
async function updateProduct(id, name, price, category_id, client = pool) {
  try {
    const query =
      "UPDATE products SET name = $1, price = $2, category_id = $3 WHERE id = $4 RETURNING *";
    const values = [name, price, category_id, id];
    const result = await client.query(query, values);
    if (result.rowCount === 0) {
      throw new Error(`No product found with id ${id}`);
    }
    return result.rows[0];
  } catch (error) {
    console.error("updateProduct error:", error);
    throw error;
  }
}

/**
 * Delete a product.
 * @param {number} id - The ID of the product to delete.
 * @param {PGClient} [client] - The PostgreSQL client to use. Defaults to the pool.

@returns {Promise<void>}
*/
async function deleteProduct(id, client = pool) {
  try {
    const query = "DELETE FROM products WHERE id = $1";
    const values = [id];
    const result = await client.query(query, values);
    if (result.rowCount === 0) {
      throw new Error(`No product found with id ${id}`);
    }
  } catch (error) {
    console.error("deleteProduct error:", error);
    throw error;
  }
}
module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
