const { CaseOrder } = require("../../models");
const { Op } = require("sequelize");

exports.fetchFinishCase = async (req, res, next) => {
  try {
    const doctorId = req.user.id;
    const finishCase = await CaseOrder.findAll({
      where: { [Op.and]: [{ doctorId }, { status: "finish" }] },
    });
    res.status(201).json({ finishCase });
  } catch (err) {
    next(err);
  }
};
