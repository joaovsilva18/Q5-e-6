const { pool } = require("../../src/db/db");
const {
  getAllDiscountCodes,
  getDiscountCodeById,
  getDiscountCodeByCode,
  createDiscountCode,
  updateDiscountCode,
  deleteDiscountCode,
} = require("../../src/repositories/discountCodes");
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

describe("DiscountCode Repository", () => {
  describe("getAllDiscountCodes", () => {
    it("should retrieve all discount codes from the database", async () => {
      await pool.query(
        "INSERT INTO discountcodes (code, type, value, expiration_date, minimum_order_value) VALUES ('TEST10', 'percentage', 10, '2023-01-01', 50)"
      );
      await pool.query(
        "INSERT INTO discountcodes (code, type, value, expiration_date, minimum_order_value) VALUES ('TEST20', 'percentage', 20, '2023-01-01', 100)"
      );

      const discountCodes = await getAllDiscountCodes();

      expect(discountCodes).toHaveLength(2);
      expect(discountCodes[0].code).toBe("TEST10");
      expect(discountCodes[1].code).toBe("TEST20");
    });

    it("should return an empty array if no discount codes exist", async () => {
      const discountCodes = await getAllDiscountCodes();
      expect(discountCodes).toHaveLength(0);
    });
  });

  describe("getDiscountCodeById", () => {
    it("should retrieve a discount code by ID from the database", async () => {
      const insertedDiscountCode = await pool.query(
        "INSERT INTO discountcodes (code, type, value, expiration_date, minimum_order_value) VALUES ('TEST10', 'percentage', 10, '2023-01-01', 50) RETURNING *"
      );

      const discountCode = await getDiscountCodeById(
        insertedDiscountCode.rows[0].id
      );

      expect(discountCode).toBeDefined();
      expect(discountCode?.code).toBe("TEST10");
      expect(discountCode?.type).toBe("percentage");
      expect(discountCode?.value).toBe(10);
    });

    it("should return null if the discount code does not exist", async () => {
      const discountCode = await getDiscountCodeById(999);
      expect(discountCode).toBeNull();
    });
  });

  describe("getDiscountCodeByCode", () => {
    it("should retrieve a discount code by code from the database", async () => {
      const insertedDiscountCode = await pool.query(
        "INSERT INTO discountcodes (code, type, value, expiration_date, minimum_order_value) VALUES ('TEST10', 'percentage', 10, '2023-01-01', 50) RETURNING *"
      );

      const discountCode = await getDiscountCodeByCode("TEST10");

      expect(discountCode).toBeDefined();
      expect(discountCode?.code).toBe("TEST10");
      expect(discountCode?.type).toBe("percentage");
      expect(discountCode?.value).toBe(10);
    });

    it("should return null if the discount code does not exist", async () => {
      const discountCode = await getDiscountCodeByCode("TEST999");
      expect(discountCode).toBeNull();
    });
  });

  describe("createDiscountCode", () => {
    it("should create a new discount code in the database", async () => {
      const createdDiscountCode = await createDiscountCode(
        "TEST10",
        "percentage",
        10,
        "2023-01-01",
        50
      );

      expect(createdDiscountCode).toBeDefined();
      expect(createdDiscountCode.code).toBe("TEST10");
      expect(createdDiscountCode.type).toBe("percentage");
      expect(createdDiscountCode.value).toBe(10);
      expect(createdDiscountCode.minimum_order_value).toBe(50);
    });

    it("should create a new discount code with no minimum_order_value", async () => {
      const createdDiscountCode = await createDiscountCode(
        "TEST10",
        "percentage",
        10,
        "2023-01-01",
        null
      );

      expect(createdDiscountCode).toBeDefined();
      expect(createdDiscountCode.code).toBe("TEST10");
      expect(createdDiscountCode.type).toBe("percentage");
      expect(createdDiscountCode.value).toBe(10);
      expect(createdDiscountCode.minimum_order_value).toBeNull();
    });
  });

  describe("updateDiscountCode", () => {
    it("should update an existing discount code in the database", async () => {
      const insertedDiscountCode = await pool.query(
        "INSERT INTO discountcodes (code, type, value, expiration_date, minimum_order_value) VALUES ('TEST10', 'percentage', 10, '2023-01-01', 50) RETURNING *"
      );

      const updatedDiscountCode = await updateDiscountCode(
        insertedDiscountCode.rows[0].id,
        "TEST20",
        20,
        "percentage",
        "2023-01-01",
        100
      );

      expect(updatedDiscountCode).toBeDefined();
      expect(updatedDiscountCode.code).toBe("TEST20");
      expect(updatedDiscountCode.type).toBe("percentage");
      expect(updatedDiscountCode.value).toBe(20);
      expect(updatedDiscountCode.minimum_order_value).toBe(100);
    });

    it("should update an existing discount code with no minimum_order_value", async () => {
      const insertedDiscountCode = await pool.query(
        "INSERT INTO discountcodes (code, type, value, expiration_date, minimum_order_value) VALUES ('TEST10', 'percentage', 10, '2023-01-01', 50) RETURNING *"
      );

      const updatedDiscountCode = await updateDiscountCode(
        insertedDiscountCode.rows[0].id,
        "TEST20",
        20,
        "percentage",
        "2023-01-01",
        null
      );

      expect(updatedDiscountCode).toBeDefined();
      expect(updatedDiscountCode.code).toBe("TEST20");
      expect(updatedDiscountCode.type).toBe("percentage");
      expect(updatedDiscountCode.value).toBe(20);
      expect(updatedDiscountCode.minimum_order_value).toBeNull();
    });

    it("should throw an error if the discount code to update does not exist", async () => {
      await expect(() =>
        updateDiscountCode(999, "TEST20", 20, "percentage", "2023-01-01", 100)
      ).rejects.toThrow("No discount code found with id 999");
    });
  });

  describe("deleteDiscountCode", () => {
    it("should delete a discount code by its ID", async () => {
      const insertedDiscountCode = await pool.query(
        "INSERT INTO discountcodes (code, type, value, expiration_date, minimum_order_value) VALUES ('TEST10', 'percentage', 10, '2023-01-01', 50) RETURNING *"
      );

      await deleteDiscountCode(insertedDiscountCode.rows[0].id);

      const discountCodes = await getAllDiscountCodes();
      expect(discountCodes).toHaveLength(0);
    });

    it("should throw an error if the discount code to delete does not exist", async () => {
      await expect(() => deleteDiscountCode(999)).rejects.toThrow(
        "No discount code found with id 999"
      );
    });
  });
});
