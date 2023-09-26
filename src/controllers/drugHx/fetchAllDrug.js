const { Treatment, CaseOrder } = require("../../models");

exports.fetchAllDrug = async (req, res, next) => {
  try {
    const { patientId } = req.body;
    const listAllDrug = await CaseOrder.findAll({
      where: { patientId },
      attributes: ["id", "patientId", "createdAt"],
      include: [{ model: Treatment, attributes: ["txList"] }],
    });
    res.status(201).json({ listAllDrug });
  } catch (err) {
    next(err);
  }
};
