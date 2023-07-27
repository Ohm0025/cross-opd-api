const express = require("express");
const drugController = require("../controllers/drugController");
const router = express.Router();

router.post("/get", drugController.fetchDrug);
router.post("/prescript", drugController.prescript);

module.exports = router;
