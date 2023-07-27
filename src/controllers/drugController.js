const { DrugHx } = require("../models");

exports.prescript = async (req, res, next) => {
  try {
    const { drugName, diagnosis, type, patientId, caseId } = req.body;
    const drugHx = await DrugHx.create({
      drugName,
      diagnosis,
      type,
      patientId,
      caseId,
    });
    res.status(201).json({ drugHx });
  } catch (err) {
    next(err);
  }
};

exports.fetchDrug = async (req, res, next) => {
  try {
    const { patientId } = req.body;
    const drugHx = await DrugHx.findAll({
      where: {
        patientId,
      },
    });
    res.status(201).json({ drugHx });
  } catch (err) {
    next(err);
  }
};
