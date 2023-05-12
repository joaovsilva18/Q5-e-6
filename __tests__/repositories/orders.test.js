const { pool } = require("../../src/db/db");
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} = require("../../src/repositories/orders");
const { createUser } = require("../../src/repositories/users");
const {
  createDatabaseFromSchema,
  eraseDatabase,
  disconnectDatabase,
} = require("../helpers");

beforeEach(async () => {
  await eraseDatabase();
  await createDatabaseFromSchema();
});

afterAll(async () => {
  await eraseDatabase();
  await disconnectDatabase();
});

describe("Order Repository", () => {
  /**
   * @type {User}
   */
  let user;

  beforeEach(async () => {
    user = await createUser("John", "john@example.com", "password");
  });

  describe("getAllOrders", () => {
    it("should retrieve all orders from the database", async () => {
      await pool.query(
        "INSERT INTO orders (user_id, confirmed) VALUES ($1, $2)",
        [user.id, true]
      );
      await pool.query(
        "INSERT INTO orders (user_id, confirmed) VALUES ($1, $2)",
        [user.id, false]
      );

      const orders = await getAllOrders();

      expect(orders).toHaveLength(2);
      expect(orders[0].user_id).toBe(user.id);
      expect(orders[1].user_id).toBe(user.id);
    });

    it("should return an empty array if no orders exist", async () => {
      const orders = await getAllOrders();
      expect(orders).toHaveLength(0);
    });
  });

  describe("getOrderById", () => {
    it("should retrieve an order by ID from the database", async () => {
      const insertedOrder = await pool.query(
        "INSERT INTO orders (user_id, confirmed) VALUES ($1, $2) RETURNING *",
        [user.id, true]
      );

      const order = await getOrderById(insertedOrder.rows[0].id);

      expect(order).toBeDefined();
      expect(order?.user_id).toBe(user.id);
      expect(order?.confirmed).toBe(true);
    });

    it("should return null if the order does not exist", async () => {
      const order = await getOrderById(999);
      expect(order).toBeNull();
    });
  });

  describe("createOrder", () => {
    it("should create a new order in the database", async () => {
      const createdOrder = await createOrder(user.id, true);

      expect(createdOrder).toBeDefined();
      expect(createdOrder.user_id).toBe(user.id);
      expect(createdOrder.confirmed).toBe(true);
    });
  });

  describe("updateOrder", () => {
    it("should update an existing order in the database", async () => {
      const insertedOrder = await pool.query(
        "INSERT INTO orders (user_id, confirmed) VALUES ($1, $2) RETURNING *",
        [user.id, true]
      );

      const updatedOrder = await updateOrder(insertedOrder.rows[0].id, false);

      expect(updatedOrder).toBeDefined();
      expect(updatedOrder.confirmed).toBe(false);
    });

    it("should throw an error if the order to update does not exist", async () => {
      await expect(() => updateOrder(999, false)).rejects.toThrow(
        "No order found with id 999"
      );
    });
  });

  describe("deleteOrder", () => {
    it("should delete an existing order from the database", async () => {
      const insertedOrder = await pool.query(
        "INSERT INTO orders (user_id, confirmed) VALUES ($1, $2) RETURNING *",
        [user.id, true]
      );

      await deleteOrder(insertedOrder.rows[0].id);

      const orderItems = await getAllOrders();

      expect(orderItems).toHaveLength(0);
    });

    it("should throw an error if the order to delete does not exist", async () => {
      await expect(() => deleteOrder(999)).rejects.toThrow();
    });
  });
});
