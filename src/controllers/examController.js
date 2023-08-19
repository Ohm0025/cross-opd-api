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
  updateData,
  createDiagList,
  createList,
  deleteRow,
  checkExistRow,
} = require("../services/examServices/activatedOpd");

exports.acivatedOpd = async (req, res, next) => {
  try {
    const doctorId = req.user.id;
    const { patientId } = req.body;

    const pendingCase = await getPendingCase(patientId, doctorId);

    if (pendingCase) {
      return res.status(201).json({ newCase: pendingCase });
    }

    const waitCase = await getWaitingPt(patientId);

    if (!waitCase) {
      throw new AppError("not found patientId", 404);
    }
    const caseOrder = await createData(CaseOrder, {
      location: waitCase?.location || "wait for error",
      status: "pending",
      doctorId,
      patientId,
      type: "regular",
    });

    const chiefComplaint =
      waitCase?.chief_complaint_first &&
      (await createData(ChiefComplaint, {
        title: waitCase?.chief_complaint_first,
        caseId: caseOrder.id,
      }));

    const presentIllness =
      waitCase?.present_illness_first &&
      (await createData(PresentIll, {
        title: waitCase?.present_illness_first,
        caseId: caseOrder.id,
      }));

    await sequelize.query(
      "UPDATE wait_cases SET status = ? WHERE status = ? AND patient_id = ?",
      {
        type: QueryTypes.UPDATE,
        replacements: ["inprogress", "waiting", patientId],
      }
    );

    res.status(201).json({
      caseOrder,
      chiefComplaint,
      presentIllness,
    });
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
      include: [
        { model: ChiefComplaint, where: { caseId } },
        { model: PresentIll, where: { caseId } },
      ],
    });
    res.status(201).json({ currentCase });
  } catch (err) {
    next(err);
  }
};

exports.completeCase = async (req, res, next) => {
  try {
    const caseId = +req.params.caseId;
    const {
      patientId,
      inputData: { cc, pi, pe, diag, img, lab, detailDx, ad, fu },
    } = req.body;

    const waitCase = await getWaitingPt(patientId);

    //speacial for diag = [{diagName , diagTx : [{tx_title , tx_type , tx_detail},...]}]

    await updateData(
      CaseOrder,
      {
        status: "finish",
      },
      { where: { id: caseId } }
    );

    await updateData(
      ChiefComplaint,
      { title: cc.title },
      { where: { caseId } }
    );
    await updateData(
      PresentIll,
      { title: pi.title, piImg: pi.piImg || "" },
      { where: { caseId } }
    );
    if (checkExistRow(caseId, PhysicalExam)) {
      await updateData(
        PhysicalExam,
        {
          examManual: pe.examManual || "",
          examTemplate: pe.examTemplate || "",
          examImg: pe.examImg || "",
        },
        { where: { caseId } }
      );
    } else {
      await createData(PhysicalExam, {
        examManual: pe.examManual || "",
        examTemplate: pe.examTemplate || "",
        examImg: pe.examImg || "",
        caseId,
      });
    }
    if (checkExistRow(caseId, DetailDiag)) {
      await updateData(
        DetailDiag,
        {
          detail: detailDx.detail || "",
        },
        { where: { caseId } }
      );
    } else {
      await createData(DetailDiag, {
        detail: detailDx.detail || "",
        caseId,
      });
    }
    if (checkExistRow(caseId, Advice)) {
      await updateData(
        Advice,
        {
          detail: ad.detail || "",
        },
        { where: { caseId } }
      );
    } else {
      await createData(Advice, {
        detail: ad.detail || "",
        caseId,
      });
    }
    if (checkExistRow(caseId, FollowUp)) {
      await updateData(
        FollowUp,
        {
          fuHos: fu.fuHos || "",
          fuOPD: fu.fuOPD || "",
          fuDetail: fu.fuDetail || "",
          fuDate: fu.fuDate || "",
        },
        { where: { caseId } }
      );
    } else {
      await createData(FollowUp, {
        fuHos: fu.fuHos || "",
        fuOPD: fu.fuOPD || "",
        fuDetail: fu.fuDetail || "",
        fuDate: fu.fuDate || "",
        caseId,
      });
    }

    createDiagList(Diagnosis, Treatment, diag, caseId);
    createList(Imaging, img, caseId);
    createList(LabOrder, lab, caseId);
    deleteRow(waitCase.id, WaitCase);

    res.status(201).json({ message: "create success" });
  } catch (err) {
    next(err);
  }
};
