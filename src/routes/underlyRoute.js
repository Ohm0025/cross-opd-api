const express = require("express");
const { fetchUnderly } = require("../controllers/underly/fetchUnderly");
const { updateUnderly } = require("../controllers/underly/updateUnderly");
const { getUnderlyTreat } = require("../controllers/underly/getUnderlyTreat");
const router = express.Router();

router.post("/fetch", fetchUnderly);
router.patch("/update", updateUnderly);
router.post("/getTx", getUnderlyTreat);

module.exports = router;
