const { UserPatient } = require("../../models");

exports.editAllergy = async (req, res, next) => {
  try {
    const { patientId, editAllergy } = req.body;
    await UserPatient.update(
      { allergy: editAllergy },
      { where: { id: patientId } }
    );
    res.status(201).json({ message: "edit success" });
  } catch (err) {
    next(err);
  }
};
