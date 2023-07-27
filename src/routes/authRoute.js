const express = require("express");
const authController = require("../controllers/authController");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.post("/register/:typeaccount", authController.register);
router.post("/login/:typeaccount", authController.login);
router.get("/me", authenticate, authController.getme);

module.exports = router;
