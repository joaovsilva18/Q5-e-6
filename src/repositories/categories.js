const { pool } = require("../db/db"); // Assuming you have set up a PostgreSQL connection pool

/**
 * Retrieve all categories.
 * @param {PGClient} [client] - The PostgreSQL client to use for the operation.
 * @returns {Promise<Array<Category>>} - A Promise resolving to an array of category objects.
 */
async function getAllCategories(client = pool) {
  try {
    const result = await client.query("SELECT * FROM categories");
    return result.rows;
  } catch (error) {
    console.error("getAllCategories error:", error);
    throw error;
  }
}

/**
 * Get a specific category by ID.
 * @param {number} id - The ID of the category to retrieve.
 * @param {PGClient} [client] - The PostgreSQL client to use for the operation.
 * @returns {Promise<Category|null>} - A Promise resolving to the category object, or null if not found.
 */
async function getCategoryById(id, client = pool) {
  try {
    const query = "SELECT * FROM categories WHERE id = $1";
    const values = [id];
    const result = await client.query(query, values);
    return result.rows[0] || null;
  } catch (error) {
    console.error("getCategoryById error:", error);
    throw error;
  }
}

/**
 * Create a new category.
 * @param {string} name - The name of the category.
 * @param {PGClient} [client] - The PostgreSQL client to use for the operation.
 * @returns {Promise<Category>} - A Promise resolving to the created category object.
 */
async function createCategory(name, client = pool) {
  try {
    const query = "INSERT INTO categories (name) VALUES ($1) RETURNING *";
    const values = [name];
    const result = await client.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("createCategory error:", error);
    throw error;
  }
}

/**
 * Update an existing category.
 * @param {number} id - The ID of the category to update.
 * @param {string} name - The updated name of the category.
 * @param {PGClient} [client] - The PostgreSQL client to use for the operation.
 * @returns {Promise<Category>} - A Promise resolving to the updated category object, or null if not found.
 */
async function updateCategory(id, name, client = pool) {
  try {
    const query = "UPDATE categories SET name = $1 WHERE id = $2 RETURNING *";
    const values = [name, id];
    const result = await client.query(query, values);
    if (result.rowCount === 0) {
      throw new Error(`No category found with id ${id}`);
    }
    return result.rows[0];
  } catch (error) {
    console.error("updateCategory error:", error);
    throw error;
  }
}

/**
 * Delete a category.
 * @param {number} id - The ID of the category to delete.
 * @param {PGClient} [client] - The PostgreSQL client to use for the operation.
 * @returns {Promise<void>}
 */
async function deleteCategory(id, client = pool) {
  try {
    const query = "DELETE FROM categories WHERE id = $1";
    const values = [id];
    const result = await client.query(query, values);
    if (result.rowCount === 0) {
      throw new Error(`No category found with id ${id}`);
    }
  } catch (error) {
    console.error("deleteCategory error:", error);
    throw error;
  }
}

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
