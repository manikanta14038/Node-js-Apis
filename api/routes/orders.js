const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/checkAuth");
const ordersController = require("../controllers/orders");

router.get("/", checkAuth, ordersController.orders_get_all);

router.post("/", checkAuth, ordersController.creat_order);

router.get("/:orderId", checkAuth, ordersController.get_a_order);

router.delete("/:orderId", checkAuth, ordersController.delete_order);

module.exports = router;
