const { pool } = require("../../src/db/db");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../../src/repositories/products");
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

describe("Product Repository", () => {
  describe("getAllProducts", () => {
    it("should retrieve all products from the database", async () => {
      await pool.query("INSERT INTO categories (name) VALUES ('Category A')");
      await pool.query("INSERT INTO categories (name) VALUES ('Category B')");
      await pool.query(
        "INSERT INTO products (name, price, category_id) VALUES ('Product A', 100, 1)"
      );
      await pool.query(
        "INSERT INTO products (name, price, category_id) VALUES ('Product B', 200, 2)"
      );

      const products = await getAllProducts();

      expect(products).toHaveLength(2);
      expect(products[0].name).toBe("Product A");
      expect(products[1].name).toBe("Product B");
    });

    it("should return an empty array if no products exist", async () => {
      const products = await getAllProducts();
      expect(products).toHaveLength(0);
    });
  });

  describe("getProductById", () => {
    it("should retrieve a product by ID from the database", async () => {
      await pool.query("INSERT INTO categories (name) VALUES ('Category A')");
      const insertedProduct = await pool.query(
        "INSERT INTO products (name, price, category_id) VALUES ('Product A', 100, 1) RETURNING *"
      );

      const product = await getProductById(insertedProduct.rows[0].id);

      expect(product).toBeDefined();
      expect(product?.name).toBe("Product A");
      expect(product?.price).toBe(100);
      expect(product?.category_id).toBe(1);
    });

    it("should return null if the product does not exist", async () => {
      const product = await getProductById(999);
      expect(product).toBeNull();
    });
  });

  describe("createProduct", () => {
    it("should create a new product in the database", async () => {
      await pool.query("INSERT INTO categories (name) VALUES ('Category A')");
      const createdProduct = await createProduct("Product A", 100, 1);

      expect(createdProduct).toBeDefined();
      expect(createdProduct.name).toBe("Product A");
      expect(createdProduct.price).toBe(100);
      expect(createdProduct.category_id).toBe(1);
    });
  });

  describe("updateProduct", () => {
    it("should update an existing product in the database", async () => {
      await pool.query(
        "INSERT INTO categories (name) VALUES ('Category A') RETURNING *"
      );
      await pool.query(
        "INSERT INTO categories (name) VALUES ('Category B') RETURNING *"
      );
      const insertedProduct = await pool.query(
        "INSERT INTO products (name, price, category_id) VALUES ('Product A', 100, 1) RETURNING *"
      );

      const updatedProduct = await updateProduct(
        insertedProduct.rows[0].id,
        "Product B",
        200,
        2
      );

      expect(updatedProduct).toBeDefined();
      expect(updatedProduct.name).toBe("Product B");
      expect(updatedProduct.price).toBe(200);
      expect(updatedProduct.category_id).toBe(2);
    });

    it("should throw an error if the product to update does not exist", async () => {
      await expect(() =>
        updateProduct(999, "Product B", 200, 2)
      ).rejects.toThrow("No product found with id 999");
    });
  });

  describe("deleteProduct", () => {
    it("should delete a product by its ID", async () => {
      await pool.query("INSERT INTO categories (name) VALUES ('Category A')");
      const insertedProduct = await pool.query(
        "INSERT INTO products (name, price, category_id) VALUES ('Product A', 100, 1) RETURNING *"
      );

      await deleteProduct(insertedProduct.rows[0].id);

      const products = await getAllProducts();
      expect(products).toHaveLength(0);
    });

    it("should throw an error if the product to delete does not exist", async () => {
      await expect(() => deleteProduct(999)).rejects.toThrow(
        "No product found with id"
      );
    });
  });
});
