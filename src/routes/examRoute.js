const express = require("express");
const examController = require("../controllers/examController");

const router = express.Router();

const uploadMiddleWare = require("../middleware/uploadMiddleWare");

router.post("/activate", examController.acivatedOpd);
router.get("/finish", examController.fetchFinishCase);
router.get("/unfinish", examController.fetchUnfinishCase);
router.post(`/${":caseId"}`, examController.fetchCurrentPt);
router.post("/:caseId/createRecord", examController.createRecord);

module.exports = router;
