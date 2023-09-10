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
  UserDoctor,
} = require("../../models");

exports.fetchSelectedPast = async (req, res, next) => {
  try {
    const caseId = +req.body.caseId;

    const selectedPastCase = await CaseOrder.findOne({
      attributes: ["id", "updatedAt", "location", "doctorId"],
      include: [
        {
          model: ChiefComplaint,
          attributes: ["title"],
          where: {
            caseId,
          },
        },
        {
          model: PresentIll,
          attributes: ["title"],
          where: {
            caseId,
          },
        },
        {
          model: PhysicalExam,
          attributes: ["examManual", "examTemplate", "examImg"],
          where: {
            caseId,
          },
        },
        {
          model: Diagnosis,
          attributes: ["diagName"],
          where: {
            caseId,
          },
        },
        {
          model: DetailDiag,
          attributes: ["detail"],
          where: {
            caseId,
          },
        },
        {
          model: LabOrder,
          attributes: ["labArray"],
          where: {
            caseId,
          },
        },
        {
          model: Imaging,
          attributes: ["imgArray"],
          where: {
            caseId,
          },
        },
        {
          model: Advice,
          attributes: ["detail"],
          where: {
            caseId,
          },
        },
        {
          model: FollowUp,
          attributes: ["fuHos", "fuOPD", "fuDetail", "fuDate"],
          where: {
            caseId,
          },
        },
        {
          model: Treatment,
          attributes: ["txList"],
          where: {
            caseId,
          },
        },
      ],
      where: { id: caseId },
    });
    const doctorObj = await UserDoctor.findOne({
      where: { id: selectedPastCase.doctorId },
      attributes: ["firstName", "lastName"],
    });
    res.status(201).json({ selectedPastCase, doctorObj });
  } catch (err) {
    next(err);
  }
};
