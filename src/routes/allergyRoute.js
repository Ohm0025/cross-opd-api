const express = require("express");
const { fetchAllergy } = require("../controllers/allergy/fetchAllergy");
const { editAllergy } = require("../controllers/allergy/editAllergy");
const router = express.Router();

router.post("/fetchAllergy", fetchAllergy);
router.patch("/editAllergy", editAllergy);

module.exports = router;
