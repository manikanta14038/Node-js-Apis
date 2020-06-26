const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const userRoutes=require('./api/routes/users');
mongoose.connect(
  "mongodb://localhost:27017/mydb?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
// mongoose.Promise=global.Promise;
app.use(morgan("dev"));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH");
    return res.status(200).json({});
  }
  next();
});
//routes which should handle requests
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use('/user',userRoutes);
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});
app.use((err, req, res, next) => {
  res.status(err.status).json({
    error: {
      msg: err.message,
      status: err.status,
    },
  });
});
module.exports = app;
