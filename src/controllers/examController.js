const AppError = require("../utility/appError");
const { Op, QueryTypes } = require("sequelize");
const {
  CaseOrder,
  ChiefComplaint,
  PresentIll,
  PhysicalExam,
  LabOrder,
  Imaging,
  Diagnosis,
  DetailDiag,
  Treatment,
  Advice,
  FollowUp,
  WaitCase,
  sequelize,
} = require("../models");
const {
  getPendingCase,
  getWaitingPt,
  createData,
} = require("../services/examServices/activatedOpd");

exports.acivatedOpd = async (req, res, next) => {
  try {
    const doctorId = req.user.id;
    const { patientId } = req.body;

    const pendingCase = await getPendingCase(patientId, doctorId);

    if (pendingCase) {
      return res.status(201).json({ newCase: pendingCase[0] });
    }

    const waitCase = await getWaitingPt(patientId);

    if (!waitCase) {
      throw new AppError("not found patientId", 404);
    }
    // const chiefComplaint = await ChiefComplaint.create({
    //   title: waitCase[0]?.chief_complaint_first,
    // });

    const chiefComplaint = await createData(ChiefComplaint, {
      title: waitCase?.chief_complaint_first,
    });

    const presentIllness = await createData(PresentIll, {
      title: waitCase?.present_illness_first,
    });

    const physicalExam = await createData(PhysicalExam, {});

    const labOrder = await createData(LabOrder, {});

    const imaging = await createData(Imaging, {});
    const treatment = await createData(Treatment, {});

    const diagnosis = await createData(Diagnosis, {
      txId:treatment.id
    });

    const detailDiag = await createData(DetailDiag, {});


    const followUp = await createData(FollowUp, {});

    const advice = await createData(Advice, {});

    const caseOrder = await createData(CaseOrder, {
      location: waitCase?.location || "wait for error",
      status: "pending",
      doctorId,
      patientId,
      type: "regular",
      chiefComplaintId: chiefComplaint?.id,
      presentIllId: presentIllness?.id,
      physicalExamId: physicalExam?.id,
      labOrderId: labOrder?.id,
      imgOrderId: imaging?.id,
      txId: treatment?.id,
      diagId: diagnosis?.id,
      detailDiagId: detailDiag?.id,
      followUpId: followUp?.id,
      adviceId: advice?.id,
    });

    await sequelize.query(
      "UPDATE wait_cases SET status = ? WHERE status = ? AND patient_id = ?",
      {
        type: QueryTypes.UPDATE,
        replacements: ["inprogress", "waiting", patientId],
      }
    );

    res.status(201).json({ caseOrder });
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
