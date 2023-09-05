const {
  CaseOrder,
  ChiefComplaint,
  PresentIll,
  PhysicalExam,
  Diagnosis,
  DetailDiag,
  LabOrder,
  Imaging,
  Advice,
  FollowUp,
} = require("../../models");

exports.fetchCurrentCase = async (req, res, next) => {
  try {
    const caseId = +req.params.caseId;
    // const currentCase = await sequelize.query(
    //   "SELECT * FROM case_orders LEFT JOIN chief_complaints ON chief_complaints.case_id = case_orders.id WHERE case_orders.id = ? LIMIT 1;",
    //   {
    //     type: QueryTypes.SELECT,
    //     replacements: [caseId],
    //     raw: true,
    //   }
    // );

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
        {
          model: LabOrder,
          attributes: ["labArray"],
          where: { caseId },
        },
        {
          model: Imaging,
          attributes: ["imgArray"],
          where: { caseId },
        },
      ],
    });

    res.status(201).json({ currentCase });
  } catch (err) {
    next(err);
  }
};
