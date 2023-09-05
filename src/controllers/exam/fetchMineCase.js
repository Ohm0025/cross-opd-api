const { CaseOrder } = require("../../models");
const { Op } = require("sequelize");

exports.fetchMyCase = async (req, res, next) => {
  try {
    let today = new Date();
    let day = 60 * 60 * 24 * 1000;
    let tomorrow = new Date(today.getTime() + day);
    let yesterday = new Date(today.getTime() - day);

    const doctorId = req.user.id;
    const caseIn24 = await CaseOrder.findAll({
      where: {
        [Op.and]: [
          { doctorId },
          { status: "finish" },
          //   { createdAt: { where: { [Op.between]: [tomorrow, yesterday] } } },
        ],
      },
    });
    res
      .status(201)
      .json({
        finishCase: caseIn24.filter((item) => item.status === "finish"),
        unfinishCase: caseIn24.filter((item) => item.status === "pending"),
      });
  } catch (err) {
    next(err);
  }
};
