const { UserPatient } = require("../../models");
const AppError = require("../../utility/appError");

exports.updateUnderly = async (req, res, next) => {
  try {
    //newListUnderly = [ {ud_name : "Hypertension" , ud_updater : "kim sabu" , ud_location : "tondum"} , "COPD"]
    const { patientId, newListUnderly } = req.body;
    const listUnderly = await UserPatient.update(
      { underlying: newListUnderly },
      { where: { id: patientId } }
    );
    if (!listUnderly) {
      throw new AppError("no this patient id", 400);
    }
    console.log("wfnop" + newListUnderly);
    res.status(201).json({ message: "update success" });
  } catch (err) {
    next(err);
  }
};
