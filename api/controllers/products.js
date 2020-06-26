const Product = require("../models/products");
const mongoose = require("mongoose");

exports.get_all_products = (req, res, next) => {
  Product.find()
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        docs: docs.map((doc) => {
          return {
            name: doc.name,
            price: doc.price,
            productImage: doc.productImage,
            _id: doc._id,
            response: {
              type: "GET",
              url: "http://localhost:3000/products/" + doc._id,
            },
          };
          s;
        }),
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.post_a_product = (req, res, next) => {
  // console.log(req.file);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.originalname,
  });
  product
    .save()
    .then((result) => {
      res.status(201).json({
        msg: "created product successfully",
        product: {
          name: result.name,
          price: result.price,
          _id: result._id,
          productImage: req.file.originalname,
          response: {
            type: "GET",
            url: "http://localhost:3000/products/" + result._id,
          },
        },
      });
    })
    .catch((e) => {
      res.status(500).json(e);
    });
};

exports.get_product = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("name price _id")
    .exec()
    .then((doc) => {
      res.status(200).json({
        doc: doc,
      });
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({
        error: e,
      });
    });
};

exports.change_product = (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "product updated",
        resquest: {
          type: "GET",
          url: "http://localhost:3000/products/" + id,
        },
      });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

exports.delete_product = (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "product deleted",
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "product not available",
      });
    });
};
