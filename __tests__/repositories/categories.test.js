const { pool } = require("../../src/db/db");
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../../src/repositories/categories");
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

describe("Category Repository", () => {
  describe("getAllCategories", () => {
    it("should retrieve all categories from the database", async () => {
      await pool.query("INSERT INTO categories (name) VALUES ('Electronics')");
      await pool.query("INSERT INTO categories (name) VALUES ('Clothing')");

      const categories = await getAllCategories();

      expect(categories).toHaveLength(2);
      expect(categories[0].name).toBe("Electronics");
      expect(categories[1].name).toBe("Clothing");
    });

    it("should return an empty array if no categories exist", async () => {
      const categories = await getAllCategories();
      expect(categories).toHaveLength(0);
    });
  });

  describe("getCategoryById", () => {
    it("should retrieve a category by ID from the database", async () => {
      const insertedCategory = await pool.query(
        "INSERT INTO categories (name) VALUES ('Electronics') RETURNING *"
      );

      const category = await getCategoryById(insertedCategory.rows[0].id);

      expect(category).toBeDefined();
      expect(category?.name).toBe("Electronics");
    });

    it("should return null if the category does not exist", async () => {
      const category = await getCategoryById(999);
      expect(category).toBeNull();
    });
  });

  describe("createCategory", () => {
    it("should create a new category in the database", async () => {
      const createdCategory = await createCategory("Electronics");

      expect(createdCategory).toBeDefined();
      expect(createdCategory.name).toBe("Electronics");
    });
  });

  describe("updateCategory", () => {
    it("should update an existing category in the database", async () => {
      const insertedCategory = await pool.query(
        "INSERT INTO categories (name) VALUES ('Electronics') RETURNING *"
      );

      const updatedCategory = await updateCategory(
        insertedCategory.rows[0].id,
        "Updated Electronics"
      );

      expect(updatedCategory).toBeDefined();
      expect(updatedCategory.name).toBe("Updated Electronics");
    });

    it("should throw an error if the category to update does not exist", async () => {
      await expect(() =>
        updateCategory(999, "Updated Electronics")
      ).rejects.toThrow("No category found with id 999");
    });
  });

  describe("deleteCategory", () => {
    it("should delete a category by ID from the database", async () => {
      const insertedCategory = await pool.query(
        "INSERT INTO categories (name) VALUES ('Electronics') RETURNING *"
      );

      await deleteCategory(insertedCategory.rows[0].id);

      const category = await getCategoryById(insertedCategory.rows[0].id);
      expect(category).toBeNull();
    });

    it("should throw an error if the category to delete does not exist", async () => {
      await expect(() => deleteCategory(999)).rejects.toThrow(
        "No category found with id 999"
      );
    });
  });
});
