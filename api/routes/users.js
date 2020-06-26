const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");
const checkAuth = require("../middleware/checkAuth");

router.get("/", userController.get_all_users);

router.post("/signup",userController.signUp);

router.post("/login", userController.login);

router.delete("/:userId", checkAuth,userController.delete_user);

module.exports = router;
