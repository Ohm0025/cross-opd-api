const express = require("express");
const examController = require("../controllers/examController");

const router = express.Router();

router.post("/activate", examController.acivatedOpd);
router.get("/finish", examController.fetchFinishCase);
router.get("/unfinish", examController.fetchUnfinishCase);
router.post("/:caseId", examController.fetchCurrentPt);
router.post("/:caseId/complete", examController.completeCase);

module.exports = router;
