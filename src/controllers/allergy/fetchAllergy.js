const { UserPatient } = require("../../models");

exports.fetchAllergy = async (req, res, next) => {
  try {
    const { patientId } = req.body;
    //allergyObjList:[{name,symptoms,editor,dateAt}]
    const allergyObjList = await UserPatient.findOne({
      where: { id: patientId },
      attributes: ["allergy"],
    });
    res.status(201).json({ allergyObjList: allergyObjList?.allergy });
  } catch (err) {
    next(err);
  }
};
