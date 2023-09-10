const { Treatment } = require("../../models");
const {
  createData,
  updateData,
} = require("../../services/examServices/activatedOpd");

exports.fetchTreatment = async (req, res, next) => {
  try {
    const { diagId } = req.body;
    const currentTreatmentList = await Treatment.findOne({
      where: { diagId: +diagId },
    });
    res.status(201).json({ currentTreatmentList });
  } catch (err) {
    next(err);
  }
};

exports.updateTreatment = async (req, res, next) => {
  try {
    const { diagId, txArr } = req.body;

    //find exist row
    const selectRow = await Treatment.findOne({ where: { diagId: +diagId } });
    //update if exist and create if not
    if (selectRow) {
      await createData(Treatment, {
        txList: JSON.stringify(txArr),
        diagId,
      });
    } else {
      await updateData(
        Treatment,
        {
          txList: JSON.stringify(txArr),
        },
        { where: { diagId } }
      );
    }
    await Treatment;
  } catch (err) {
    next(err);
  }
};
