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
} = require("../models");

exports.fetchAllPast = async (req, res, next) => {
  try {
    const allPastCase = await CaseOrder.findAll({
      attributes: ["id", "updatedAt"],
      where: { patientId: req.body.patientId },
    });
    const lastPastCase = await CaseOrder.findOne({
      attributes: ["id", "updatedAt"],
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
        // {
        //   model: LabOrder,
        //   attributes: ["labName", "labStatus", "labImg", "labDescript"],
        //   where: {
        //     caseId: allPastCase[0].id,
        //   },
        // },
        // {
        //   model: Imaging,
        //   attributes: ["imgName", "imgStatus", "imgImg", "imgDescript"],
        //   where: {
        //     caseId: allPastCase[0].id,
        //   },
        // },
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
      ],
      where: { patientId: req.body.patientId },
    });
    res.status(201).json({ allPastCase, lastPastCase });
  } catch (err) {
    next(err);
  }
};
