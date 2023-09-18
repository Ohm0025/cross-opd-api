const { CaseOrder, FollowUp } = require("../../models");
const { Op } = require("sequelize");
const { changeTimeZone } = require("../../utility/formatData/formatTime");

exports.fetchFollowUp = async (req, res, next) => {
  try {
    const { patientId } = req.body;

    // let today = new Date().toLocaleString("TH");
    let today = new Date().getDate();

    const listFu = await CaseOrder.findAll({
      where: { patientId },
      attributes: ["id", "doctor_id"],
      //   include: FollowUp,
      include: [
        {
          model: FollowUp,
          where: {
            [Op.or]: [{ fuDate: { [Op.gte]: today } }],
          },
        },
      ],
    });
    res.status(201).json({ listFu });
  } catch (err) {
    next(err);
  }
};
