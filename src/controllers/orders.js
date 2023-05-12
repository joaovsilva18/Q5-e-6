const validators = require("../validators");
const ordersService = require("../services/orders");

/**
 *
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 */
async function getOrderItemsByOrderId(req, res) {
  const order_id = Number(req.params.order_id);
  const user_id = req.user.id;

  validators.validatePositiveIntegerNumber(order_id, "order_id");

  const orderItems = await ordersService.getOrderItemsByOrderId(
    order_id,
    user_id
  );

  res.json({
    err: null,
    data: orderItems,
  });
}

/**
 *
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 */
async function updateOrderItem(req, res) {
  const order_id = Number(req.params.order_id);
  const product_id = Number(req.params.product_id);
  const { quantity } = req.body;
  const user_id = req.user.id;

  validators.validatePositiveIntegerNumber(order_id, "order_id");
  validators.validatePositiveIntegerNumber(product_id, "product_id");
  validators.validatePositiveIntegerNumber(quantity, "quantity");

  await ordersService.updateOrderItem(order_id, product_id, quantity, user_id);

  res.json({
    err: null,
    data: null,
  });
}

/**
 *
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 */
async function getOrderDiscountCodesByOrderId(req, res) {
  const order_id = Number(req.params.order_id);
  const user_id = req.user.id;

  validators.validatePositiveIntegerNumber(order_id, "order_id");

  const discountCodes = await ordersService.getOrderDiscountCodesByOrderId(
    order_id,
    user_id
  );

  res.json({
    err: null,
    data: discountCodes,
  });
}
/**
 *
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 */
async function addOrderDiscountCodeToOrderByCode(req, res) {
  // TODO
  // ........
  await ordersService.addOrderDiscountCodeToOrderByCode(999, "999", 999);
  // ......
}

module.exports = {
  getOrderItemsByOrderId,
  getOrderDiscountCodesByOrderId,
  updateOrderItem,
  addOrderDiscountCodeToOrderByCode,
};
