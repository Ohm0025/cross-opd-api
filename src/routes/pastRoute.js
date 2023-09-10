const express = require("express");
const { fetchAllPast } = require("../controllers/pastHx/fetchAllPast");
const {
  fetchSelectedPast,
} = require("../controllers/pastHx/fetchSelectedPast");

const router = express.Router();

router.post("/", fetchAllPast);
router.post("/selectedPast", fetchSelectedPast);

module.exports = router;
