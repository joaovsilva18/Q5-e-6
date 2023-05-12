const { pool } = require("../../src/db/db");
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../../src/repositories/users");
const {
  createDatabaseFromSchema,
  eraseDatabase,
  disconnectDatabase,
} = require("../helpers");

beforeEach(async () => {
  await eraseDatabase();
  await createDatabaseFromSchema();
});

// Clean up the test database after running the tests
afterAll(async () => {
  await eraseDatabase();
  await disconnectDatabase();
});

describe("User Repository", () => {
  describe("getAllUsers", () => {
    it("should retrieve all users from the database", async () => {
      // Insert some users into the database

      await pool.query(
        "INSERT INTO users (name, email, password) VALUES ('John', 'john@example.com', 'password')"
      );
      await pool.query(
        "INSERT INTO users (name, email, password) VALUES ('Jane', 'jane@example.com', 'password')"
      );

      // Call the function being tested
      const users = await getAllUsers();

      // Assert the expected results
      expect(users).toHaveLength(2);
      expect(users[0].name).toBe("John");
      expect(users[1].name).toBe("Jane");

      // Release the database connection
    });

    it("should return an empty array if no users exist", async () => {
      // Call the function being tested
      const users = await getAllUsers();

      // Assert the expected results
      expect(users).toHaveLength(0);
    });
  });

  describe("getUserById", () => {
    it("should retrieve a user by ID from the database", async () => {
      // Insert a user into the database
      const insertedUser = await pool.query(
        "INSERT INTO users (name, email, password) VALUES ('John', 'john@example.com', 'password') RETURNING *"
      );

      // Call the function being tested
      const user = await getUserById(insertedUser.rows[0].id);

      // Assert the expected results
      expect(user).toBeDefined();
      expect(user?.name).toBe("John");
      expect(user?.email).toBe("john@example.com");
    });

    it("should return null if the user does not exist", async () => {
      // Call the function being tested
      const user = await getUserById(999);

      // Assert the expected results
      expect(user).toBeNull();
    });
  });

  describe("createUser", () => {
    it("should create a new user in the database", async () => {
      // Call the function being tested
      const createdUser = await createUser(
        "John",
        "john@example.com",
        "password"
      );

      // Assert the expected results
      expect(createdUser).toBeDefined();
      expect(createdUser.name).toBe("John");
      expect(createdUser.email).toBe("john@example.com");
    });
  });

  describe("updateUser", () => {
    it("should update an existing user in the database", async () => {
      // Insert a user into the database
      const insertedUser = await pool.query(
        "INSERT INTO users (name, email, password) VALUES ('John', 'john@example.com', 'password') RETURNING *"
      );
      // Call the function being tested
      const updatedUser = await updateUser(
        insertedUser.rows[0].id,
        "New Name",
        "newemail@example.com",
        "newpassword",
        100
      );

      // Assert the expected results
      expect(updatedUser).toBeDefined();
      expect(updatedUser.name).toBe("New Name");
      expect(updatedUser.email).toBe("newemail@example.com");
      expect(updatedUser.password).toBe("newpassword");
      expect(updatedUser.balance).toBe(100);
    });

    it("should throw an error if the user to update does not exist", async () => {
      // Call the function being tested and expect it to throw an error
      await expect(() =>
        updateUser(999, "New Name", "newemail@example.com", "newpassword", 100)
      ).rejects.toThrow("No user found with id 999");
    });
  });

  describe("deleteUser", () => {
    it("should delete an existing user in the database", async () => {
      // Insert a user into the database
      const insertedUser = await pool.query(
        "INSERT INTO users (name, email, password) VALUES ('John', 'john@example.com', 'password') RETURNING *"
      );
      // Call the function being tested
      await deleteUser(insertedUser.rows[0].id);

      // Assert the expected results
      const users = await getAllUsers();
      expect(users).toHaveLength(0);
    });

    it("should throw an error if the user to delete does not exist", async () => {
      // Call the function being tested and expect it to throw an error
      await expect(() => deleteUser(999)).rejects.toThrow(
        "No user found with id 999"
      );
    });
  });
});
