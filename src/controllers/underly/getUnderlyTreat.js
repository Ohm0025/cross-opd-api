const { CaseOrder, Diagnosis } = require("../../models");

exports.getUnderlyTreat = async (req, res, next) => {
  try {
    const { patientId, underlyTitle } = req.body;

    // const listCaseID = await CaseOrder.findAll({ where: { patientId } , include:[{model:}] });

    res.status(201).json({ message: "ejgoj0j" });
  } catch (err) {
    next(err);
  }
};
