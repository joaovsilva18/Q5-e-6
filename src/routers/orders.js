const { Router } = require("express");
const { authenticate } = require("../middlewares/authentication");
const ordersController = require("../controllers/orders");

const router = Router();

// DONE
router.get(
  "/:order_id/items",
  authenticate,
  ordersController.getOrderItemsByOrderId
);

// TODO tests
router.patch(
  "/:order_id/items/:product_id",
  authenticate,
  ordersController.updateOrderItem
);

// DONE
router.get(
  "/:order_id/discount-codes",
  authenticate,
  ordersController.getOrderDiscountCodesByOrderId
);

// TODO controller + service + tests
router.post(
  "/:order_id/discount-codes",
  authenticate,
  ordersController.addOrderDiscountCodeToOrderByCode
);

module.exports = router;
