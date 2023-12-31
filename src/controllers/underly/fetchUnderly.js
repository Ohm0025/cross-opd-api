const { UserPatient } = require("../../models");

exports.fetchUnderly = async (req, res, next) => {
  try {
    const { patientId } = req.body;
    const listOfUnderly = await UserPatient.findOne({
      where: { id: patientId },
      attributes: ["underlying"],
    });
    res.status(201).json({ listOfUnderly });
  } catch (err) {
    next(err);
  }
};
