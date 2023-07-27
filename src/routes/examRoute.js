const express = require("express");
const examController = require("../controllers/examController");

const router = express.Router();

router.post("/", examController.acivatedOpd);

module.exports = router;
