const { FollowUp } = require("../../models");

exports.finishFollowUp = async (req, res, next) => {
  try {
    const { fuId } = req.body;
    await FollowUp.update({ status: "finish" }, { where: { id: fuId } });
  } catch (err) {
    next(err);
  }
};
