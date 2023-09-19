const { PATIENT, DOCTOR } = require("../config/constants");
const { UserPatient, WaitCase } = require("../models");
const {
  findUserInWaitList,
  createNewWaitCase,
} = require("../services/opdServices/openCard");
const AppError = require("../utility/appError");
const { createNewCase } = require("../utility/createNewCase");
const { Op } = require("sequelize");

exports.openOpdCard = async (req, res, next) => {
  try {
    const typeaccount = req.typeaccount;
    const patientId = req.user.id;
    if (typeaccount !== PATIENT) {
      throw new AppError("your account not allow for this feature", 400);
    }
    const { location, chiefComplaintFirst, presentIllnessFirst, type } =
      req.body;

    const userWait = await findUserInWaitList(patientId, WaitCase, UserPatient);

    if (userWait) {
      throw new AppError("you are waiting Now", 400);
    }

    //create waiting database
    const waitCase = await createNewWaitCase(
      { location, patientId, chiefComplaintFirst, presentIllnessFirst, type },
      WaitCase
    );
    res.status(201).json({ waitCase });
  } catch (err) {
    next(err);
  }
};

exports.getOpdCard = async (req, res, next) => {
  try {
    const typeaccount = req.typeaccount;
    const { patientId } = req.body;

    if (typeaccount !== DOCTOR) {
      throw new AppError("your account not allow for this feature", 400);
    }
    const userPt = await WaitCase.findOne({
      where: { patientId },
      include: { model: UserPatient, attributes: { exclude: "password" } },
    });
    if (!userPt) {
      throw new AppError("not found this patient user are waiting", 400);
    }
    const input = {
      location: userPt.location,
      patientId: userPt.patientId,
      doctorId: req.user.id,
      cc: userPt.chiefComplaintFirst,
    };
    const resultCase = await createNewCase(input);
    res.status(201).json({ resultCase });
  } catch (err) {
    next(err);
  }
};

//fetch opd card ของ patient
exports.fetchOpdCard = async (req, res, next) => {
  try {
    const { patientId } = req.body;
    await WaitCase.destroy({
      where: {
        createdAt: { [Op.lte]: new Date(Date.now() - 60 * 60 * 24 * 1000) },
      },
    });
    const waitCase = await WaitCase.findOne({
      where: { patientId },
    });

    res.status(201).json({ waitCase });
  } catch (err) {
    next(err);
  }
};

exports.deleteOpdCard = async (req, res, next) => {
  try {
    const { waitCaseId } = req.params;
    const selectCase = await WaitCase.findOne({
      where: { [Op.and]: [{ id: +waitCaseId }, { patientId: req.user.id }] },
    });
    if (!selectCase) {
      throw new AppError("you not allow to delete this card", 400);
    }
    await selectCase.destroy();
    res.status(201).json({ message: "delete success" });
  } catch (err) {
    next(err);
  }
};

exports.editOpdCard = async (req, res, next) => {
  try {
    const { updateCase, waitCaseId } = req.body;

    await WaitCase.update(updateCase, { where: { id: waitCaseId } });
    res.status(201).json({ message: "update success" });
  } catch (err) {
    next(err);
  }
};
