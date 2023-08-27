const express = require("express");
const pastController = require("../controllers/pastController");

const router = express.Router();

router.post("/", pastController.fetchAllPast);

module.exports = router;
