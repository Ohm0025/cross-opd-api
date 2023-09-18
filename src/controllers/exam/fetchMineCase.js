const { CaseOrder } = require("../../models");
const { Op } = require("sequelize");
const { changeTimeZone } = require("../../utility/formatData/formatTime");

exports.fetchMyCase = async (req, res, next) => {
  try {
    let today = changeTimeZone(new Date(), "Asia/Bangkok");
    let day = 60 * 60 * 24 * 1000;
    let tomorrow = new Date(today.getTime() + day);
    let yesterday = new Date(today.getTime() - day);

    // console.log(yesterday);
    // console.log(today);
    // console.log(tomorrow);

    const doctorId = req.user.id;
    const caseIn24 = await CaseOrder.findAll({
      where: {
        [Op.and]: [
          { doctorId },
          // { createdAt: { [Op.between]: [tomorrow, yesterday] } },
        ],
      },
    });
    console.log("we" + caseIn24);
    res.status(201).json({
      finishCase: caseIn24.filter((item) => item.status === "finish"),
      unfinishCase: caseIn24.filter((item) => item.status === "pending"),
    });
  } catch (err) {
    next(err);
  }
};
