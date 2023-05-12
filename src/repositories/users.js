const { pool } = require("../db/db"); // Assuming you have set up a PostgreSQL connection pool

/**
 * Retrieve all users.
 * @param {PGClient} [client] - The PostgreSQL client to use.
 * @returns {Promise<Array<User>>} - A Promise resolving to an array of user objects.
 */
async function getAllUsers(client = pool) {
  try {
    const result = await client.query("SELECT * FROM users");
    return result.rows;
  } catch (error) {
    console.error("getAllUsers error:", error);
    throw error;
  }
}

/**
 * Get a specific user by ID.
 * @param {number} id - The ID of the user to retrieve.
 * @param {PGClient} [client] - The PostgreSQL client to use.
 * @returns {Promise<User|null>} - A Promise resolving to the user object, or null if not found.
 */
async function getUserById(id, client = pool) {
  try {
    const query = "SELECT * FROM users WHERE id = $1";
    const values = [id];
    const result = await client.query(query, values);
    return result.rows[0] || null;
  } catch (error) {
    console.error("getUserById error:", error);
    throw error;
  }
}

/**
 * Create a new user.
 * @param {string} name - The name of the user.
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @param {PGClient} [client] - The PostgreSQL client to use.
 * @returns {Promise<User>} - A Promise resolving to the created user object.
 */
async function createUser(name, email, password, client = pool) {
  try {
    const query =
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *";
    const values = [name, email, password];
    const result = await client.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("createUser error:", error);
    throw error;
  }
}

/**
 * Update an existing user.
 * @param {number} id - The ID of the user to update.
 * @param {string} name - The updated name of the user.
 * @param {string} email - The updated email of the user.
 * @param {string} password - The updated password of the user.
 * @param {number} balance
 * @param {PGClient} [client] - The PostgreSQL client to use.
 * @returns {Promise<User>} - A Promise resolving to the updated user object, or null if not found.
 */
async function updateUser(id, name, email, password, balance, client = pool) {
  try {
    const query =
      "UPDATE users SET name = $1, email = $2, password = $3, balance = $4 WHERE id = $5 RETURNING *";
    const values = [name, email, password, balance, id];
    const result = await client.query(query, values);
    if (result.rowCount === 0) {
      throw new Error(`No user found with id ${id}`);
    }
    return result.rows[0];
  } catch (error) {
    console.error("updateUser error:", error);
    throw error;
  }
}

/**
 * Delete a user.
 * @param {number} id - The ID of the user to delete.
 * @param {PGClient} [client] - The PostgreSQL client to use.
 * @returns {Promise<void>}
 */
async function deleteUser(id, client = pool) {
  try {
    const query = "DELETE FROM users WHERE id = $1";
    const values = [id];
    const result = await client.query(query, values);
    if (result.rowCount === 0) {
      throw new Error(`No user found with id ${id}`);
    }
  } catch (error) {
    console.error("deleteUser error:", error);
    throw error;
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
