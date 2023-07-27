const AppError = require("../utility/appError");
const { UserPatient, CaseOrder, ChiefComplaint } = require("../models");

exports.acivatedOpd = async (req, res, next) => {
  try {
    const { id: ptId } = req.user;
    console.log(ptId);
    const { location, cc } = req.body;
    const userPt = await UserPatient.findOne({ where: { id: ptId } });
    if (!userPt) {
      throw new AppError("this user don't exist.", 400);
    }
    const chiefComplaint = await ChiefComplaint.create({
      title: cc,
    });
    const new_case = await CaseOrder.create({
      location,
      patientId: ptId,
      chiefComplaintId: chiefComplaint.id,
      status: "waiting",
      doctorId: null,
    });

    res.status(200).json({ new_case });
  } catch (err) {
    next(err);
  }
};
