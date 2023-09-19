const {
  CaseOrder,
  ChiefComplaint,
  PresentIll,
  PhysicalExam,
  LabOrder,
  Imaging,
  Diagnosis,
  DetailDiag,
  Advice,
  FollowUp,
  WaitCase,
  Treatment,
} = require("../../models");
const {
  getWaitingPt,
  updateData,
  checkExistRow,
  deleteRow,
} = require("../../services/examServices/activatedOpd");
const { arrayToString } = require("../../utility/formatData/arrayFormat");

exports.createRecord = async (req, res, next) => {
  try {
    const caseId = +req.params.caseId;

    const { pePic, labPic, imgPic } = req.files;
    const { patientId, inputData, detailDrug, detailProcedure, typeStatus } =
      req.body;
    const waitCase = await getWaitingPt(patientId);

    const { cc, pi, pe, diag, img, lab, detailDx, ad, fu, tx } =
      JSON.parse(inputData);

    //update db_caseOrder
    // await updateData(
    //   CaseOrder,
    //   { status: "finish" },
    //   { where: { id: caseId } }
    // );

    await CaseOrder.update({ status: typeStatus }, { where: { id: caseId } });
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
        },
        { where: { caseId } }
      );
    } else {
      await createData(PhysicalExam, {
        examManual: pe.examManual || "",
        examTemplate: pe.examTemplate || "",
        caseId: caseId,
      });
    }
    pePic?.length > 0
      ? await updateData(
          PhysicalExam,
          { examImg: req.body.oldPePic + arrayToString(pePic) },
          { where: { caseId } }
        )
      : await updateData(
          PhysicalExam,
          { examImg: req.body.oldPePic },
          { where: { caseId } }
        );

    //update diag
    await updateData(
      Diagnosis,
      {
        diagName: JSON.stringify(diag),
      },
      { where: { caseId } }
    );

    //update treatment
    await updateData(
      Treatment,
      {
        txList: JSON.stringify(tx),
      },
      {
        where: { caseId },
      }
    );
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
    //upload lab photo
    let uploadLab = JSON.parse(req.body?.oldLabPic);
    console.log(uploadLab);
    uploadLab?.forEach((item1) => {
      console.log(item1);
      labPic?.forEach((item2) => {
        console.log(item2);
        if (item2.originalname === item1.name) {
          console.log("name true");
          //item1.img = [...item1.img, item2.filename];
          item1.img.push(item2.filename);
        }
      });
    });

    await updateData(
      LabOrder,
      {
        labArray: JSON.stringify(uploadLab),
      },
      { where: { caseId } }
    );
    // console.log("upload = " + uploadLab);
    //create or update db_img
    //upload img photo
    let uploadImg = JSON.parse(req.body?.oldImgPic);
    uploadImg?.forEach((item1) => {
      imgPic?.forEach((item2) => {
        if (item2.originalname === item1.name) {
          item1.img.push(item2.filename);
        }
      });
    });
    await updateData(
      Imaging,
      {
        imgArray: JSON.stringify(uploadImg),
      },
      { where: { caseId } }
    );

    // createDiagList(
    //   Diagnosis,
    //   Treatment,
    //   diag,
    //   caseId,
    //   detailDrug,
    //   detailProcedure
    // );
    // createLabList(LabOrder, lab, caseId);
    // createImgList(Imaging, img, caseId);

    //delete waitCase
    if (typeStatus === "finish") {
      waitCase && deleteRow(waitCase.id, WaitCase);
    }
    res.status(201).json({ message: "create complete" });
  } catch (err) {
    next(err);
  }
};
