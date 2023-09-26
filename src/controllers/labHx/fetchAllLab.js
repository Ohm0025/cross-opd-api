const { CaseOrder, LabOrder } = require("../../models");

exports.fetchAllLab = async (req, res, next) => {
  try {
    const { patientId } = req.body;
    const allPastLab = await CaseOrder.findAll({
      attributes: ["id", "updatedAt", "doctorId"],
      where: { patientId, status: "finish" },
      include: [{ model: LabOrder }],
    });

    if (allPastLab.length === 0) {
      return res.status(201).json({ allPastLab: [] });
    }
    // const lastPastLab = await CaseOrder.findOne({
    //   attributes: ["id", "updatedAt", "location"],
    //   include: [
    //     {
    //       model: LabOrder,
    //       attributes: ["labArray"],
    //       where: {
    //         caseId: allPastLab[0].id,
    //       },
    //     },
    //   ],
    // });

    res.status(201).json({
      allPastLab: allPastLab.filter(
        (item) => item.LabOrder.labArray && item.LabOrder.labArray !== "[]"
      ),
    });
    //validate
  } catch (err) {
    next(err);
  }
};
