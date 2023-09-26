const { CaseOrder, Imaging } = require("../../models");

exports.fetchAllImg = async (req, res, next) => {
  try {
    const { patientId } = req.body;
    const allPastImg = await CaseOrder.findAll({
      attributes: ["id", "updatedAt", "doctorId"],
      where: { patientId, status: "finish" },
      include: [{ model: Imaging }],
    });

    if (allPastImg.length === 0) {
      return res.status(201).json({ allPastImg: [] });
    }

    res.status(201).json({
      allPastImg: allPastImg.filter(
        (item) => item.Imaging.imgArray && item.Imaging.imgArray !== "[]"
      ),
    });
  } catch (err) {
    next(err);
  }
};
