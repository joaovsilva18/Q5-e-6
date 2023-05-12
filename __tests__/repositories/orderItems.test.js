const { pool } = require("../../src/db/db");
const {
  getAllOrderItems,
  getOrderItemsByOrderId,
  createOrderItem,
  updateOrderItem,
  deleteOrderItem,
  getOrderItemsWithProductInformationByOrderId,
} = require("../../src/repositories/orderItems");
const { createUser } = require("../../src/repositories/users");
const { createOrder } = require("../../src/repositories/orders");
const {
  createDatabaseFromSchema,
  eraseDatabase,
  disconnectDatabase,
} = require("../helpers");
const { createProduct } = require("../../src/repositories/products");
const { createCategory } = require("../../src/repositories/categories");

beforeEach(async () => {
  await eraseDatabase();
  await createDatabaseFromSchema();
});

afterAll(async () => {
  await eraseDatabase();
  await disconnectDatabase();
});

describe("Order Item Repository", () => {
  let user;

  /**
   * @type {Order}
   */
  let order;

  beforeEach(async () => {
    user = await createUser("John", "john@example.com", "password");
    order = await createOrder(user.id, true);
  });

  describe("getAllOrderItems", () => {
    it("should retrieve all order items from the database", async () => {
      await createCategory("Category A");
      await createProduct("Product A", 10, 1);
      await createProduct("Product B", 20, 1);
      await pool.query(
        "INSERT INTO orderitems (order_id, product_id, quantity) VALUES ($1, $2, $3)",
        [order.id, 1, 5]
      );
      await pool.query(
        "INSERT INTO orderitems (order_id, product_id, quantity) VALUES ($1, $2, $3)",
        [order.id, 2, 10]
      );

      const orderItems = await getAllOrderItems();

      expect(orderItems).toHaveLength(2);
      expect(orderItems[0].order_id).toBe(order.id);
      expect(orderItems[1].order_id).toBe(order.id);
    });

    it("should return an empty array if no order items exist", async () => {
      const orderItems = await getAllOrderItems();
      expect(orderItems).toHaveLength(0);
    });
  });

  describe("getOrderItemsByOrderId", () => {
    it("should retrieve all order items for a specific order", async () => {
      await createCategory("Category A");
      await createProduct("Product A", 10, 1);
      await createProduct("Product B", 20, 1);
      await pool.query(
        "INSERT INTO orderitems (order_id, product_id, quantity) VALUES ($1, $2, $3)",
        [order.id, 1, 10]
      );
      await pool.query(
        "INSERT INTO orderitems (order_id, product_id, quantity) VALUES ($1, $2, $3)",
        [order.id, 2, 5]
      );

      const orderItems = await getOrderItemsByOrderId(order.id);

      expect(orderItems).toHaveLength(2);
      expect(orderItems[0].order_id).toBe(order.id);
      expect(orderItems[1].order_id).toBe(order.id);
    });

    it("should return an empty array if no order items exist for the specified order", async () => {
      const orderItems = await getOrderItemsByOrderId(order.id);
      expect(orderItems).toHaveLength(0);
    });
  });

  describe("getOrderItemsWithProductInformationByOrderId", () => {
    it("should retrieve all order items with product information for a specific order", async () => {
      const category = await createCategory("Category A");
      const productA = await createProduct("Product A", 10, category.id);
      const productB = await createProduct("Product B", 20, category.id);
      await pool.query(
        "INSERT INTO orderitems (order_id, product_id, quantity) VALUES ($1, $2, $3)",
        [order.id, productA.id, 10]
      );
      await pool.query(
        "INSERT INTO orderitems (order_id, product_id, quantity) VALUES ($1, $2, $3)",
        [order.id, productB.id, 5]
      );
      const orderItems = await getOrderItemsWithProductInformationByOrderId(
        order.id
      );

      expect(orderItems).toHaveLength(2);
      expect(orderItems[0].order_id).toBe(order.id);
      expect(orderItems[1].order_id).toBe(order.id);

      expect(orderItems[0].product_id).toBe(productA.id);
      expect(orderItems[0].product_name).toBe(productA.name);
      expect(orderItems[0].product_price).toBe(productA.price);
      expect(orderItems[0].product_category_id).toBe(productA.category_id);

      expect(orderItems[1].product_id).toBe(productB.id);
      expect(orderItems[1].product_name).toBe(productB.name);
      expect(orderItems[1].product_price).toBe(productB.price);
      expect(orderItems[1].product_category_id).toBe(productB.category_id);
    });

    it("should return an empty array if no order items exist for the specified order with product information", async () => {
      const orderItems = await getOrderItemsWithProductInformationByOrderId(
        order.id
      );
      expect(orderItems).toHaveLength(0);
    });
  });

  describe("createOrderItem", () => {
    it("should create a new order item in the database and return it", async () => {
      await createCategory("Category A");
      await createProduct("Product A", 10, 1);
      const orderItem = await createOrderItem(order.id, 1, 10);

      const orderItems = await getOrderItemsByOrderId(order.id);

      expect(orderItems).toHaveLength(1);
      expect(orderItems[0].order_id).toBe(order.id);
      expect(orderItems[0].product_id).toBe(1);
      expect(orderItems[0].quantity).toBe(10);
      expect(orderItems[0]).toEqual(orderItem);
    });
  });

  describe("updateOrderItem", () => {
    it("should update an existing order item in the database", async () => {
      await createCategory("Category A");
      await createProduct("Product A", 10, 1);
      await pool.query(
        "INSERT INTO orderitems (order_id, product_id, quantity) VALUES ($1, $2, $3)",
        [order.id, 1, 10]
      );

      const updatedOrderItem = await updateOrderItem(order.id, 1, 20);

      expect(updatedOrderItem).toBeDefined();
      expect(updatedOrderItem.order_id).toBe(order.id);
      expect(updatedOrderItem.product_id).toBe(1);
      expect(updatedOrderItem.quantity).toBe(20);
    });

    it("should throw an error if the order item to update does not exist", async () => {
      await expect(() => updateOrderItem(order.id, 999, 20)).rejects.toThrow(
        `updateOrderItem Error: No order item found for order ${order.id} and product 999`
      );
    });
  });

  describe("deleteOrderItem", () => {
    it("should delete an existing order item from the database", async () => {
      await createCategory("Category A");
      await createProduct("Product A", 10, 1);
      await pool.query(
        "INSERT INTO orderitems (order_id, product_id, quantity) VALUES ($1, $2, $3)",
        [order.id, 1, 10]
      );

      await deleteOrderItem(order.id, 1);

      const orderItems = await getOrderItemsByOrderId(order.id);

      expect(orderItems).toHaveLength(0);
    });

    it("should throw an error if the order item to delete does not exist", async () => {
      await expect(() => deleteOrderItem(order.id, 999)).rejects.toThrow();
    });
  });
});
