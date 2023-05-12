const { pool } = require("../../src/db/db");
const {
  addDiscountCodeToOrder,
  removeDiscountCodeFromOrder,
  getOrderDiscountCodesByOrderId,
  getOrderDiscountCodesByUserId,
} = require("../../src/repositories/orderDiscounts");
const { createDiscountCode } = require("../../src/repositories/discountCodes");
const { createOrder } = require("../../src/repositories/orders");
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

describe("OrderDiscounts Repository", () => {
  describe("addDiscountCodeToOrder", () => {
    it("should add a discount code to an order", async () => {
      const user = await createUser(
        "testuser",
        "test@example.com",
        "password123"
      );
      const order = await createOrder(user.id, false);
      const discountCode = await createDiscountCode(
        "TEST10",
        "percentage",
        10,
        "2023-01-01",
        50
      );

      await addDiscountCodeToOrder(order.id, discountCode.id);

      const discountCodes = await getOrderDiscountCodesByOrderId(order.id);

      expect(discountCodes).toHaveLength(1);
      expect(discountCodes[0].code).toBe("TEST10");
    });
  });

  describe("removeDiscountCodeFromOrder", () => {
    it("should remove a discount code from an order", async () => {
      const user = await createUser(
        "testuser",
        "test@example.com",
        "password123"
      );
      const order = await createOrder(user.id, false);
      const discountCode = await createDiscountCode(
        "TEST10",
        "percentage",
        10,
        "2023-01-01",
        50
      );

      await addDiscountCodeToOrder(order.id, discountCode.id);

      await removeDiscountCodeFromOrder(order.id, discountCode.id);

      const discountCodes = await getOrderDiscountCodesByOrderId(order.id);

      expect(discountCodes).toHaveLength(0);
    });

    it("should throw an error if the discount code is not associated with the order", async () => {
      const user = await createUser(
        "testuser",
        "test@example.com",
        "password123"
      );
      const order = await createOrder(user.id, false);
      const discountCode = await createDiscountCode(
        "TEST10",
        "percentage",
        10,
        "2023-01-01",
        50
      );

      await expect(() =>
        removeDiscountCodeFromOrder(order.id, discountCode.id)
      ).rejects.toThrow(
        `Discount code ${discountCode.id} not found for order ${order.id}`
      );
    });
  });

  describe("getOrderDiscountCodesByOrderId", () => {
    it("should retrieve all discount codes applied to an order", async () => {
      const user = await createUser(
        "testuser",
        "test@example.com",
        "password123"
      );
      const order = await createOrder(user.id, false);
      const discountCode1 = await createDiscountCode(
        "TEST10",
        "percentage",
        10,
        "2023-01-01",
        50
      );
      const discountCode2 = await createDiscountCode(
        "TEST20",
        "percentage",
        20,
        "2023-01-01",
        100
      );

      await addDiscountCodeToOrder(order.id, discountCode1.id);
      await addDiscountCodeToOrder(order.id, discountCode2.id);

      const discountCodes = await getOrderDiscountCodesByOrderId(order.id);

      expect(discountCodes).toHaveLength(2);
      expect(discountCodes[0].code).toBe("TEST10");
      expect(discountCodes[1].code).toBe("TEST20");
    });

    it("should return an empty array if no discount codes are applied to the order", async () => {
      const user = await createUser(
        "testuser",
        "test@example.com",
        "password123"
      );
      const order = await createOrder(user.id, false);

      const discountCodes = await getOrderDiscountCodesByOrderId(order.id);

      expect(discountCodes).toHaveLength(0);
    });
  });

  describe("getOrderDiscountCodesByUserId", () => {
    it("should retrieve all discount codes applied to all orders of the user", async () => {
      const user = await createUser(
        "testuser",
        "test@example.com",
        "password123"
      );
      const order1 = await createOrder(user.id, false);
      const order2 = await createOrder(user.id, false);
      const discountCode1 = await createDiscountCode(
        "TEST10",
        "percentage",
        10,
        "2023-01-01",
        50
      );
      const discountCode2 = await createDiscountCode(
        "TEST20",
        "percentage",
        20,
        "2023-01-01",
        100
      );

      await addDiscountCodeToOrder(order1.id, discountCode1.id);
      await addDiscountCodeToOrder(order2.id, discountCode2.id);

      const discountCodes = await getOrderDiscountCodesByUserId(user.id);

      expect(discountCodes).toHaveLength(2);
      expect(discountCodes[0].code).toBe("TEST10");
      expect(discountCodes[1].code).toBe("TEST20");
    });

    it("should return an empty array if no discount codes are applied to any orders of the user", async () => {
      const user = await createUser(
        "testuser",
        "test@example.com",
        "password123"
      );
      await createOrder(user.id, false);
      await createOrder(user.id, false);

      const discountCodes = await getOrderDiscountCodesByUserId(user.id);

      expect(discountCodes).toHaveLength(0);
    });
  });
});
