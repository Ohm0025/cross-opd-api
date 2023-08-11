const express = require("express");

const opdController = require("../controllers/opdController");

const router = express.Router();

router.post("/open", opdController.openOpdCard);
router.post("/wait", opdController.fetchOpdCard);
router.delete("/cancel/:waitCaseId", opdController.deleteOpdCard);
router.patch("/edit", opdController.editOpdCard);
router.post("/search", opdController.getOpdCard);

module.exports = router;
