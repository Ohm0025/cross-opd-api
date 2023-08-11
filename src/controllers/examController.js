const AppError = require("../utility/appError");
const { Op, QueryTypes } = require("sequelize");
const { CaseOrder, ChiefComplaint, WaitCase, sequelize } = require("../models");

exports.acivatedOpd = async (req, res, next) => {
  try {
    const doctorId = req.user.id;
    const { patientId } = req.body;

    const pendingCase = await sequelize.query(
      "SELECT * FROM case_orders WHERE patient_id = ? AND status = ? AND doctor_id = ?",
      {
        type: QueryTypes.SELECT,
        replacements: [patientId, "pending", doctorId],
      }
    );

    if (pendingCase[0]) {
      return res.status(201).json({ newCase: pendingCase[0] });
    }

    const waitCase = await sequelize.query(
      "SELECT * FROM wait_cases WHERE status = ? AND patient_id = ?",
      {
        type: QueryTypes.SELECT,
        replacements: ["waiting", patientId],
      }
    );

    if (!waitCase[0]) {
      throw new AppError("not found patientId", 404);
    }
    const chiefComplaint = await ChiefComplaint.create({
      title: waitCase[0]?.chief_complaint_first,
    });
    const newCase = await CaseOrder.create({
      location: waitCase[0]?.location || "wait for error",
      status: "pending",
      chiefComplaintId: chiefComplaint?.id,
      doctorId,
      patientId,
      type: "regular",
    });

    await sequelize.query(
      "UPDATE wait_cases SET status = ? WHERE status = ? AND patient_id = ?",
      {
        type: QueryTypes.UPDATE,
        replacements: ["inprogress", "waiting", patientId],
      }
    );

    res.status(201).json({ newCase });
  } catch (err) {
    next(err);
  }
};

exports.fetchFinishCase = async (req, res, next) => {
  try {
    const doctorId = req.user.id;
    const finishCase = await CaseOrder.findAll({
      where: { [Op.and]: [{ doctorId }, { status: "finish" }] },
    });
    res.status(201).json({ finishCase });
  } catch (err) {
    next(err);
  }
};

exports.fetchUnfinishCase = async (req, res, next) => {
  try {
    const doctorId = req.user.id;
    const unfinishCase = await CaseOrder.findAll({
      where: { [Op.and]: [{ doctorId }, { status: "pending" }] },
    });
    res.status(201).json({ unfinishCase });
  } catch (err) {
    next(err);
  }
};

exports.fetchCurrentPt = async (req, res, next) => {
  try {
    const caseId = +req.params.caseId;

    const currentCase = await CaseOrder.findOne({
      where: { id: caseId },
      include: { model: ChiefComplaint },
    });
    res.status(201).json({ currentCase });
  } catch (err) {
    next(err);
  }
};

exports.completeCase = async (req, res, next) => {
  try {
    const caseId = +req.params.caseId;
    const {} = req.body;
  } catch (err) {
    next(err);
  }
};
