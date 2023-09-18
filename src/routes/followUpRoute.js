const express = require("express");
const { fetchFollowUp } = require("../controllers/followUp/fetchFollowUp");
const {
  activateFollowUp,
} = require("../controllers/followUp/activateFollowUp");

const router = express.Router();

router.post("/ptFetch", fetchFollowUp);
router.post("/ptActivate", activateFollowUp);

module.exports = router;
