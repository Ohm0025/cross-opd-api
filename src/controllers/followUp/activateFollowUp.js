const { Op } = require("sequelize");
const { WaitCase, FollowUp, UserPatient } = require("../../models");
const {
  findUserInWaitList,
  createNewWaitCase,
} = require("../../services/opdServices/openCard");
const AppError = require("../../utility/appError");

exports.activateFollowUp = async (req, res, next) => {
  try {
    const { fuId } = req.body;
    const patientId = req.user.id;

    let today = new Date();

    const otherFu = await FollowUp.findOne({
      where: { id: fuId },
    });
    //validate follow up
    let result = Math.ceil(
      new Date(otherFu.fuDate).getTime() / (1000 * 3600 * 24) -
        today.getTime() / (1000 * 3600 * 24)
    );
    if (!result) {
      const userWait = await findUserInWaitList(
        patientId,
        WaitCase,
        UserPatient
      );
      if (userWait) {
        throw new AppError("you are waiting Now", 400);
      } else {
        const waitCase = await createNewWaitCase(
          {
            location: otherFu.fuHos,
            patientId,
            chiefComplaintFirst: "มาตามนัด",
            presentIllnessFirst: `${otherFu.createdAt}`,
          },
          WaitCase
        );
        res
          .status(201)
          .json({ message: "activate followUp", otherFu, waitCase });
      }
    } else {
      res.status(400).json({ message: "not yet", today, otherFu });
    }
  } catch (err) {
    next(err);
  }
};
