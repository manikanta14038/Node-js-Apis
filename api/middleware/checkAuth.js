const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "qwertyuiop");
    req.userToken = decoded;
    next();
  } catch (err) {
    res.status(401).json({
      msg: "Auth required",
      err: err,
    });
  }
};
