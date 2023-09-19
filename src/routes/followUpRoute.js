const express = require("express");
const { fetchFollowUp } = require("../controllers/followUp/fetchFollowUp");
const {
  activateFollowUp,
} = require("../controllers/followUp/activateFollowUp");
const { cancelFollowUp } = require("../controllers/followUp/cancelFollowUp");
const { finishFollowUp } = require("../controllers/followUp/finishFollowUp");

const router = express.Router();

router.post("/ptFetch", fetchFollowUp);
router.post("/ptActivate", activateFollowUp);
router.patch("/ptCancel", cancelFollowUp);
router.patch("/finishFu", finishFollowUp);

module.exports = router;
