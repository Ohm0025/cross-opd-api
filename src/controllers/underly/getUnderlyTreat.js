const {
  CaseOrder,
  Diagnosis,
  Advice,
  FollowUp,
  Treatment,
} = require("../../models");

exports.getUnderlyTreat = async (req, res, next) => {
  try {
    const { patientId, underlyTitle } = req.body;

    // const listCaseID = await CaseOrder.findAll({ where: { patientId } , include:[{model:}] });

    const allCase = await CaseOrder.findAll({
      where: { patientId, status: "finish" },
      attributes: ["id", "updatedAt", "doctorId"],
      include: [
        { model: Advice, attributes: ["detail"] },
        {
          model: FollowUp,
          attributes: ["fuHos", "fuOPD", "fuDetail", "fuDate"],
        },
        {
          model: Treatment,
          attributes: ["txList"],
        },
      ],
      order: [["updatedAt", "DESC"]],
    });

    const sendingArr = allCase.map((item) => {
      return {
        caseId: item.id,
        caseDate: item.updatedAt,
        caseDoctor: item.doctorId,
        caseDetail: item.Advice.detail,
        caseFollow: item.FollowUp, //{fuHos,fuDate,fuStatus,fuDetail}
        caseTreatment: Object.entries(
          JSON.parse(item.Treatment.txList) || {}
        ).filter((item2) => item2[0] === underlyTitle),
      };
    });

    res.status(201).json({
      sendingArr: [
        ...sendingArr.filter((item) => item.caseTreatment.length > 0),
      ],
    });
  } catch (err) {
    next(err);
  }
};
