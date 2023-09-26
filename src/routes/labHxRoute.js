const express = require("express");
const { fetchAllLab } = require("../controllers/labHx/fetchAllLab");
const { fetchSelectedLab } = require("../controllers/labHx/fetchSelectedLab");

const router = express.Router();

router.post("/", fetchAllLab);
router.post("/selectedLab", fetchSelectedLab);

module.exports = router;
