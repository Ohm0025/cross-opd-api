const {
  WaitCase,
  CaseOrder,
  Advice,
  ChiefComplaint,
  PresentIll,
  Diagnosis,
  DetailDiag,
  FollowUp,
  Imaging,
  LabOrder,
  PhysicalExam,
  Treatment,
} = require("../../models");
const { changeTimeZone } = require("../../utility/formatData/formatTime");

module.exports = async (req, res, next) => {
  try {
    //let today = changeTimeZone(new Date(), "Asia/Bangkok");
    let today = new Date();
    let day = 60 * 60 * 24 * 1000;
    let yesterday = new Date(today.getTime() - day);
    const { user } = req.body;
    await WaitCase.destroy({
      where: {
        patientId: user.id,
        createdAt: { [Op.lt]: yesterday },
      },
    });
    const remainCase = await CaseOrder.findOne({
      where: {
        patientId,
        createdAt: { [Op.lt]: yesterday },
        status: "pending",
      },
    });

    //if have remain case
    if (remainCase) {
      await CaseOrder.destroy({
        where: {
          patientId,
          createdAt: { [Op.lt]: yesterday },
          status: "pending",
        },
      });
      await ChiefComplaint.destroy({
        where: {
          caseId: remainCase.id,
        },
      });
      await PresentIll.destroy({
        where: {
          caseId: remainCase.id,
        },
      });
      await PhysicalExam.destroy({
        where: {
          caseId: remainCase.id,
        },
      });
      await LabOrder.destroy({
        where: {
          caseId: remainCase.id,
        },
      });
      await Imaging.destroy({
        where: {
          caseId: remainCase.id,
        },
      });
      await Diagnosis.destroy({
        where: {
          caseId: remainCase.id,
        },
      });
      await DetailDiag.destroy({
        where: {
          caseId: remainCase.id,
        },
      });
      await Advice.destroy({
        where: {
          caseId: remainCase.id,
        },
      });
      await FollowUp.destroy({
        where: {
          caseId: remainCase.id,
        },
      });
      await Treatment.destroy({
        where: {
          caseId: remainCase.id,
        },
      });
    }
    next();
  } catch (err) {
    next(err);
  }
};
