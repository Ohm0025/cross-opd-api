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

  deleteRow,
  checkExistRow,
  createImgList,
  createLabList,
} = require("../services/examServices/activatedOpd");
const { arrayToString } = require("../utility/formatData/arrayFormat");

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
      newCase: caseOrder,
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
        { model: ChiefComplaint, attributes: ["title"], where: { caseId } },
        { model: PresentIll, attributes: ["title"], where: { caseId } },
        {
          model: PhysicalExam,
          attributes: ["examManual", "examTemplate", "examImg"],
          where: { caseId },
        },
        { model: Diagnosis, attributes: ["diagName"], where: { caseId } },
        { model: DetailDiag, attributes: ["detail"], where: { caseId } },
        { model: Advice, attributes: ["detail"], where: { caseId } },
        {
          model: FollowUp,
          attributes: ["fuHos", "fuOPD", "fuDetail", "fuDate"],
          where: { caseId },
        },
      ],
    });
    res.status(201).json({ currentCase });
  } catch (err) {
    next(err);
  }
};

exports.createRecord = async (req, res) => {
  try {
    const caseId = +req.params.caseId;

    const {
      patientId,
      inputData: { cc, pi, pe, diag, img, lab, detailDx, ad, fu },
      detailDrug,
      detailProcedure,
    } = req.body;
    const waitCase = await getWaitingPt(patientId);

    //update db_caseOrder
    // await updateData(
    //   CaseOrder,
    //   { status: "finish" },
    //   { where: { id: caseId } }
    // );
    await CaseOrder.update({ status: "finish" }, { where: { id: caseId } });
    //update db_chieComplaint
    await updateData(
      ChiefComplaint,
      { title: cc.title },
      { where: { caseId } }
    );
    //update db_presentill
    await updateData(
      PresentIll,
      { title: pi.title, piImg: pi.piImg || "" },
      { where: { caseId } }
    );
    //update or create db_physicalExam
    if (await checkExistRow(caseId, PhysicalExam)) {
      await updateData(
        PhysicalExam,
        {
          examManual: pe.examManual || "",
          examTemplate: pe.examTemplate || "",
          examImg: "",
        },
        { where: { caseId } }
      );
    } else {
      console.log("create pe");
      await createData(PhysicalExam, {
        exam_manual: pe.examManual || "",
        examTemplate: pe.examTemplate || "",
        examImg: "",
        caseId: caseId,
      });
    }
    //update or create db_detailDiag
    if (await checkExistRow(caseId, DetailDiag)) {
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
    //update or create db_advice
    if (await checkExistRow(caseId, Advice)) {
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
    //update or create db_followup
    if (await checkExistRow(caseId, FollowUp)) {
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
    //create or update db_diag
    createDiagList(
      Diagnosis,
      Treatment,
      diag,
      caseId,
      detailDrug,
      detailProcedure
    );
    createLabList(LabOrder, lab, caseId);
    createImgList(Imaging, img, caseId);

    //delete waitCase
    deleteRow(waitCase.id, WaitCase);

    res.status(201).json({ message: "create success" });
  } catch (err) {
    console.log(err);
  }
};

exports.updatePicture = async (req, res) => {
  try {
    const { pePic, labPic, imgPic } = req.files;
    const caseId = +req.params.caseId;

    pePic?.length > 0 &&
      (await updateData(
        PhysicalExam,
        { examImg: arrayToString(pePic) },
        { where: { caseId } }
      ));

    // lab : {name , img , status , des}
    //labPic : [{path , fileName},{}]
    if (labPic?.length > 0) {
      const listLabImg = [];
      //create listLabImg : list of originalname
      labPic.forEach((item) => {
        if (!listLabImg.includes(item.originalname)) {
          listLabImg.push(item.originalname);
        }
      });
      //
      listLabImg.forEach(async (item1) => {
        const listImg = "";
        labPic.forEach((item2) => {
          if (item2.originalname === item1) {
            listImg += item2.filename;
            listImg += " ";
          }
        });
        await updateData(
          LabOrder,
          { labImg: listImg },
          { where: { caseId, labName: item1 } }
        );
      });
    }

    if (imgPic?.length > 0) {
      const listImgImg = [];

      imgPic.forEach((item) => {
        if (!listImgImg.includes(item.originalname)) {
          listImgImg.push(item.originalname);
        }
      });

      listImgImg.forEach(async (item1) => {
        const listImg = "";
        imgPic.forEach((item2) => {
          if (item2.originalname === item1) {
            listImg += item2.filename;
            listImg += " ";
          }
        });
        await updateData(
          Imaging,
          { imgImg: listImg },
          { where: { caseId, imgName: item1 } }
        );
      });
    }
  } catch (err) {
    console.log(err);
  }
};
