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

exports.fetchAllPast = async (req, res, next) => {
  try {
    const allPastCase = await CaseOrder.findAll({
      attributes: ["id", "updatedAt", "doctorId"],
      where: { patientId: req.body.patientId, status: "finish" },
    });

    console.log(allPastCase);
    //validate empty case
    if (allPastCase.length === 0) {
      return res.status(201).json({ allPastCase: [], lastPastCase: null });
    }
    const lastPastCase = await CaseOrder.findOne({
      attributes: ["id", "updatedAt", "location"],
      include: [
        {
          model: ChiefComplaint,
          attributes: ["title"],
          where: {
            caseId: allPastCase[0].id,
          },
        },
        {
          model: PresentIll,
          attributes: ["title"],
          where: {
            caseId: allPastCase[0].id,
          },
        },
        {
          model: PhysicalExam,
          attributes: ["examManual", "examTemplate", "examImg"],
          where: {
            caseId: allPastCase[0].id,
          },
        },
        {
          model: Diagnosis,
          attributes: ["diagName"],
          where: {
            caseId: allPastCase[0].id,
          },
        },
        {
          model: DetailDiag,
          attributes: ["detail"],
          where: {
            caseId: allPastCase[0].id,
          },
        },
        {
          model: LabOrder,
          attributes: ["labArray"],
          where: {
            caseId: allPastCase[0].id,
          },
        },
        {
          model: Imaging,
          attributes: ["imgArray"],
          where: {
            caseId: allPastCase[0].id,
          },
        },
        {
          model: Advice,
          attributes: ["detail"],
          where: {
            caseId: allPastCase[0].id,
          },
        },
        {
          model: FollowUp,
          attributes: ["fuHos", "fuOPD", "fuDetail", "fuDate"],
          where: {
            caseId: allPastCase[0].id,
          },
        },
        {
          model: Treatment,
          attributes: ["txList"],
          where: {
            caseId: allPastCase[0].id,
          },
        },
        {
          model: UserDoctor,
          attributes: ["firstName", "lastName"],
          where: {
            id: allPastCase[0].doctorId,
          },
        },
      ],
      where: { patientId: req.body.patientId, status: "finish" },
    });
    res.status(201).json({ allPastCase, lastPastCase });
  } catch (err) {
    next(err);
  }
};
