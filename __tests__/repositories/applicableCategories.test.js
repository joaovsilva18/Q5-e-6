const { pool } = require("../../src/db/db");
const {
  getApplicableCategoriesByDiscountCodeId:
    getApplicableCategoriesByDiscountCodeId,
  addApplicableCategory,
  removeApplicableCategory,
} = require("../../src/repositories/applicableCategories");
const { createDiscountCode } = require("../../src/repositories/discountCodes");
const { createCategory } = require("../../src/repositories/categories");
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

describe("ApplicableCategories Repository", () => {
  describe("getApplicableCategoriesByDiscountCodeId", () => {
    it("should retrieve all applicable categories for a discount code", async () => {
      const discountCode = await createDiscountCode(
        "TEST10",
        "percentage",
        10,
        "2023-01-01",
        50
      );
      const category1 = await createCategory("Electronics");
      const category2 = await createCategory("Clothing");

      await addApplicableCategory(discountCode.id, category1.id);
      await addApplicableCategory(discountCode.id, category2.id);

      const applicableCategories =
        await getApplicableCategoriesByDiscountCodeId(discountCode.id);

      expect(applicableCategories).toHaveLength(2);
      expect(applicableCategories[0].name).toBe("Electronics");
      expect(applicableCategories[1].name).toBe("Clothing");
    });

    it("should return an empty array if no applicable categories exist for the discount code", async () => {
      const discountCode = await createDiscountCode(
        "TEST10",
        "percentage",
        10,
        "2023-01-01",
        50
      );

      const applicableCategories =
        await getApplicableCategoriesByDiscountCodeId(discountCode.id);

      expect(applicableCategories).toHaveLength(0);
    });
  });

  describe("addApplicableCategory", () => {
    it("should associate a category with a discount code", async () => {
      const discountCode = await createDiscountCode(
        "TEST10",
        "percentage",
        10,
        "2023-01-01",
        50
      );
      const category = await createCategory("Electronics");

      await addApplicableCategory(discountCode.id, category.id);

      const applicableCategories =
        await getApplicableCategoriesByDiscountCodeId(discountCode.id);

      expect(applicableCategories).toHaveLength(1);
      expect(applicableCategories[0].name).toBe("Electronics");
    });
  });

  describe("removeApplicableCategory", () => {
    it("should remove an association between a category and a discount code", async () => {
      const discountCode = await createDiscountCode(
        "TEST10",
        "percentage",
        10,
        "2023-01-01",
        50
      );
      const category = await createCategory("Electronics");

      await addApplicableCategory(discountCode.id, category.id);

      await removeApplicableCategory(discountCode.id, category.id);

      const applicableCategories =
        await getApplicableCategoriesByDiscountCodeId(discountCode.id);

      expect(applicableCategories).toHaveLength(0);
    });

    it("should throw an error if the association does not exist", async () => {
      const discountCode = await createDiscountCode(
        "TEST10",
        "percentage",
        10,
        "2023-01-01",
        50
      );
      const category = await createCategory("Electronics");

      await expect(() =>
        removeApplicableCategory(discountCode.id, category.id)
      ).rejects.toThrow(
        `Discount code ${discountCode.id} was already not applicable to category ${category.id}`
      );
    });
  });
});
