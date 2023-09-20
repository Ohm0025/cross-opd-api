const { FollowUp } = require("../../models");

exports.deleteFollowUp = async (req, res, next) => {
  try {
    const { fuId } = req.body;
    console.log(req.body);
    await FollowUp.update(
      { fuDate: "", fuHos: "", fuOPD: "", fuDetail: "" },
      { where: { id: fuId } }
    );
    res.status(201).json({ message: "delete success" });
  } catch (err) {
    next(err);
  }
};
