const { CaseOrder, LabOrder } = require("../../models");

exports.fetchSelectedLab = async (req, res, next) => {
  try {
    const { caseId } = req.body;

    const selectedPastLab = await CaseOrder.findOne({
      attributes: ["id", "updatedAt", "location", "doctorId"],
      where: { id: +caseId },
      include: [
        { model: LabOrder, attributes: ["labArray"], where: { caseId } },
      ],
    });

    res.status(201).json({ selectedPastLab });
  } catch (err) {
    next(err);
  }
};
