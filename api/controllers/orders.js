const mongoose = require("mongoose");
const Order = require("../models/orders");
const Product = require("../models/products");

exports.orders_get_all = (req, res, next) => {
  Order.find()
    .populate("productId", "name")
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map((doc) => {
          console.log(doc);
          return {
            orderId: doc._id,
            productId: doc.productId,
            quantity: doc.quantity,
            request: {
              type: "GET",
              url: "http://localhost:3000/orders/" + doc._id,
            },
          };
        }),
      });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

exports.creat_order = (req, res, next) => {
  Product.findById(req.body.productId)
    .then((product) => {
      const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        productId: req.body.productId,
        quantity: req.body.quantity,
      });
      return order.save();
    })
    .then((doc) => {
      res.status(201).json({
        msg: "Order Placed",
        order: {
          _id: doc._id,
          productId: doc.productId,
          quantity: doc.quantity,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        msg: "product not found",
        err: err,
      });
    });
};

exports.get_a_order = (req, res, next) => {
  Order.findById(req.params.orderId)
    .select("_id productId quantity")
    .populate("productId", "_id name price")
    .then((order) => {
      if (!order) {
        return res.status(404).json({
          msg: "Order not found",
        });
      }
      res.status(200).json(order);
    })
    .catch((err) => {
      res.status(500).json({
        msg: "No order found with the given id",
        error: err,
      });
    });
};

exports.delete_order = (req, res, next) => {
  Order.remove({ _id: req.params.orderId })
    .exec()
    .then(() => {
      res.status(200).json({
        msg: "Order deleted",
      });
    })
    .catch((err) => {
      res.status(500).json({
        msg: "No order found with the given id",
        error: err,
      });
    });
};
