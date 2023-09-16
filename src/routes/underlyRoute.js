const express = require("express");
const { fetchUnderly } = require("../controllers/underly/fetchUnderly");
const { updateUnderly } = require("../controllers/underly/updateUnderly");
const router = express.Router();

router.post("/fetch", fetchUnderly);
router.patch("/update", updateUnderly);

module.exports = router;
