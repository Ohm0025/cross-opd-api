const {
  ChiefComplaint,
  CaseOrder,
  PresentIll,
  PhysicalExam,
  LabOrder,
  Imaging,
  Diagnosis,
  DetailDiag,
  Advice,
  FollowUp,
  WaitCase,
} = require("../../models");
const {
  getPendingCase,
  getWaitingPt,
  createData,
  updateData,
} = require("../../services/examServices/activatedOpd");
const AppError = require("../../utility/appError");
const { Op } = require("sequelize");

exports.acivateOpd = async (req, res, next) => {
  try {
    const doctorId = req.user.id;
    const { patientId } = req.body;

    //check ว่า patient โดนตรวจอยู่ไหม
    const pendingCase = await getPendingCase(patientId, doctorId);

    //เจอว่า patient โดนเราตรวจอยู่ หรือ ตรวจไปแล้ว
    if (pendingCase) {
      //ส่ง res currentCase เป็น pendingCase ที่หาเจอ
      return res.status(201).json({ currentCase: pendingCase });
    }

    //ไม่เจอใน pending มาหาใน waitCase ต่อ
    //เจอใน waitCase แปลว่า ยังไม่เข้ารับการตรวจกับหมอคนใด
    const waitCase = await getWaitingPt(patientId);
    //ไม่เจอใน waitCase แปลว่า ไม่มีคนไข้ id นี้รอตรวจ หรือ เปิดบัตร
    if (!waitCase) {
      //ให่ส่ง error ออกไป
      throw new AppError("not found patientId", 404);
    }

    //update status waitCase เป็น inprogress
    await updateData(
      WaitCase,
      { status: "inprogress" },
      { where: { [Op.and]: [{ patientId }, { status: "waiting" }] } }
    );

    //หลังเจอใน waitCase ให้ทำการสร้าง row สำหรับ case ใหม่
    const caseOrder = await createData(CaseOrder, {
      location: waitCase?.location || "wait for error",
      status: "pending",
      doctorId,
      patientId,
      type: "regular",
    });

    //สร้าง row chiefComplaint
    const chiefComplaint = await createData(ChiefComplaint, {
      title: waitCase?.chief_complaint_first || "",
      caseId: caseOrder.id,
    });

    //สร้าง row presentillness
    const presentIllness = await createData(PresentIll, {
      title: waitCase?.present_illness_first || "",
      caseId: caseOrder.id,
    });

    //สร้าง row physicalExam
    const physicalExam = await createData(PhysicalExam, {
      caseId: caseOrder.id,
    });

    //สร้าง row laborder
    const labOrder = await createData(LabOrder, {
      caseId: caseOrder.id,
    });

    //สร้าง row imaging
    const imaging = await createData(Imaging, {
      caseId: caseOrder.id,
    });

    //สร้าง row diagnosis
    const diagnosis = await createData(Diagnosis, {
      caseId: caseOrder.id,
    });

    //สร้าง row detail diag
    const detailDx = await createData(DetailDiag, {
      caseId: caseOrder.id,
    });

    //สร้าง row advice
    const advice = await createData(Advice, {
      caseId: caseOrder.id,
    });

    //สร้าง row followup
    const followup = await createData(FollowUp, {
      caseId: caseOrder.id,
    });

    // await sequelize.query(
    //   "UPDATE wait_cases SET status = ? WHERE status = ? AND patient_id = ?",
    //   {
    //     type: QueryTypes.UPDATE,
    //     replacements: ["inprogress", "waiting", patientId],
    //   }
    // );

    // WaitCase.update(
    //   { status: "inprogress" },
    //   { where: { [Op.and]: [{ patientId }, { status: "waiting" }] } }
    // );

    //หลังจากสร้าง row ต่าง ๆ แล้วส่ง res เป็น currentCase
    res.status(201).json({
      currentCase: caseOrder,
    });
  } catch (err) {
    next(err);
  }
};
