const { Op } = require("sequelize");
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
const { DOCTOR } = require("../../config/constants");
const AppError = require("../../utility/appError");
const { updateData } = require("../../services/examServices/activatedOpd");

exports.cancelOpd = async (req, res, next) => {
  try {
    const doctorId = req.user.id;
    const typeaccount = req.typeaccount;
    const { caseId, patientId } = req.body;

    //check ว่า doctor เป็นคนเรียกใช้ feature นี้รึป่าว
    if (typeaccount !== DOCTOR) {
      throw new AppError("not allowed for this feature", 401);
    }

    //ลบ row ที่ต้องการ
    const result = await CaseOrder.destroy({
      where: { id: caseId, doctorId, status: "pending", patientId },
    });

    if (result > 0) {
      await ChiefComplaint.destroy({ where: { caseId } });
      await PresentIll.destroy({ where: { caseId } });
      await PhysicalExam.destroy({ where: { caseId } });
      await LabOrder.destroy({ where: { caseId } });
      await Imaging.destroy({ where: { caseId } });
      await Diagnosis.destroy({ where: { caseId } });
      await DetailDiag.destroy({ where: { caseId } });
      await Advice.destroy({ where: { caseId } });
      await FollowUp.destroy({ where: { caseId } });

      await updateData(
        WaitCase,
        { status: "waiting" },
        { where: { patientId, status: "inprogress" } }
      );
    }
    res.status(201).json({ result });
  } catch (err) {
    next(err);
  }
};
