const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/users");

exports.signUp = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length != 0) {
        res.status(409).json({
          msg: "Email exists",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            res.status(500).json(err);
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });
            user
              .save()
              .then((result) => {
                res.status(201).json({
                  msg: "user created",
                });
              })
              .catch((err) => {
                res.status(500).json(err);
              });
          }
        });
      }
    })
    .catch();
};

exports.login = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length == 0) {
        res.status(401).json({
          msg: "Email not registered",
        });
      } else {
        console.log("checking for password");
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (err) {
            res.status(401).json({
              msg: "Auth failed",
            });
          }
          if (result) {
            const token = jwt.sign(
              {
                email: user[0].email,
                userId: user[0]._id,
              },
              "qwertyuiop",
              {
                expiresIn: "1h",
              }
            );
            res.status(201).json({
              msg: "Login successful",
              token: token,
            });
          } else {
            res.status(404).json({
              msg: "Auth failed",
            });
          }
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        msg: err,
      });
    });
};

exports.get_all_users = (req, res, next) => {
  User.find()
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        users: docs,
      });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

exports.delete_user = (req, res, next) => {
  User.findById({ _id: req.params.userId })
    .exec()
    .then((result) => {
      res.status(200).json({
        msg: "user deleted",
        res: result,
      });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};
