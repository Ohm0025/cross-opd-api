const { FollowUp } = require("../../models");

exports.cancelFollowUp = async (req, res, next) => {
  try {
    const { fuId } = req.body;
    await FollowUp.update({ status: "cancel" }, { where: { id: fuId } });
  } catch (err) {
    next(err);
  }
};
