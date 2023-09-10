const express = require("express");
const examController = require("../controllers/examController");

const { fetchCurrentCase } = require("../controllers/exam/fetchCurrentCase");
const { acivateOpd } = require("../controllers/exam/activateOpd");
const { createRecord } = require("../controllers/exam/createRecord");
const { fetchMyCase } = require("../controllers/exam/fetchMineCase");
const { cancelOpd } = require("../controllers/exam/cancelOpd");

const router = express.Router();

const uploadMiddleWare = require("../middleware/uploadMiddleWare");
const {
  fetchTreatment,
  updateTreatment,
} = require("../controllers/exam/treatmentHandle");

router.post("/activate", acivateOpd);
router.post(`/${":caseId"}`, fetchCurrentCase);
router.get("/myCase", fetchMyCase);
router.get("/finish", examController.fetchFinishCase);
router.get("/unfinish", examController.fetchUnfinishCase);
router.post("/:caseId/createRecord", uploadMiddleWare, createRecord);
router.delete("/cancel", cancelOpd);

router.post("/fetchtx", fetchTreatment);
router.post("/updatetx", updateTreatment);

module.exports = router;
