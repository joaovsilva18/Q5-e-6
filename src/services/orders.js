const { createError } = require("../errors");
const orderItemsRepo = require("../repositories/orderItems");
const ordersRepo = require("../repositories/orders");
const productsRepo = require("../repositories/products");
const applicableCategoriesRepo = require("../repositories/applicableCategories");
const orderDiscountsRepo = require("../repositories/orderDiscounts");
const discountCodesRepo = require("../repositories/discountCodes");
const { validatePositiveIntegerNumber } = require("../validators");

/**
 * @param {number} order_id - id of the order
 * @param {number} user_id - id of the user who is requesting the order items
 */
async function getOrderItemsByOrderId(order_id, user_id) {
  const order = await ordersRepo.getOrderById(order_id);

  if (order === null) {
    throw createError("NotFoundError", `Order ${order_id} was not found`);
  }

  if (order.user_id !== user_id) {
    throw createError(
      "ForbiddenError",
      `User ${user_id} does not have access to order ${order_id}`
    );
  }

  return orderItemsRepo.getOrderItemsByOrderId(order_id);
}

/**
 * @param {number} order_id - id of the order
 * @param {number} product_id - id of the product to be updated inside the order
 * @param {number} quantity - the new quantity of the product inside the order
 * @param {number} user_id - id of the user who is requesting the update
 */
async function updateOrderItem(order_id, product_id, quantity, user_id) {
  const order = await ordersRepo.getOrderById(order_id);

  if (order === null) {
    throw createError("NotFoundError", `Order ${order_id} was not found`);
  }

  const product = await productsRepo.getProductById(product_id);

  if (product === null) {
    throw createError("NotFoundError", `Product ${product_id} was not found`);
  }

  if (order.user_id !== user_id) {
    throw createError(
      "ForbiddenError",
      `User ${user_id} does not have access to order ${order_id}`
    );
  }

  const orderItems = await orderItemsRepo.getOrderItemsByOrderId(order_id);

  const productInOrder = orderItems.find(
    (orderItem) => orderItem.product_id === product_id
  );

  if (productInOrder === undefined) {
    throw createError(
      "NotFoundError",
      `Product ${product_id} was not found in order ${order_id}`
    );
  }

  await orderItemsRepo.updateOrderItem(order_id, product_id, quantity);
}

/**
 * @param {number} order_id - id of the order
 * @param {number} user_id - id of the user who is requesting to add the discount code
 * @returns {Promise<DiscountCode[]>}
 */
async function getOrderDiscountCodesByOrderId(order_id, user_id) {
  const order = await ordersRepo.getOrderById(order_id);

  if (order === null) {
    throw createError("NotFoundError", `Order ${order_id} was not found`);
  }

  if (order.user_id !== user_id) {
    throw createError(
      "ForbiddenError",
      `User ${user_id} does not have access to order ${order_id}`
    );
  }

  const discountCodes = await orderDiscountsRepo.getOrderDiscountCodesByOrderId(
    order_id
  );

  return discountCodes;
}

/**
 * @param {number} order_id - id of the order
 * @param {string} code - the code of the discount code
 * @param {number} user_id - id of the user who is requesting to add the discount code
 * @returns {Promise<void>}
 */
async function addOrderDiscountCodeToOrderByCode(order_id, code, user_id) {
  // TODO
}

module.exports = {
  getOrderItemsByOrderId,
  getOrderDiscountCodesByOrderId,
  updateOrderItem,
  addOrderDiscountCodeToOrderByCode,
};
