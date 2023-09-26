const express = require("express");
const { fetchAllImg } = require("../controllers/imgHx/fetchAllImg");

const router = express.Router();

router.post("/", fetchAllImg);

module.exports = router;
