const express = require("express");
const { fetchAllDrug } = require("../controllers/drugHx/fetchAllDrug");
const router = express.Router();

router.post("/get", fetchAllDrug);
// router.post("/prescript", drugController.prescript);

module.exports = router;
