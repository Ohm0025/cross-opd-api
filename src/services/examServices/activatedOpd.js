const { sequelize } = require("../../models");
const { QueryTypes } = require("sequelize");

exports.getPendingCase = async (patientId, doctorId) => {
  const pendingCase = await sequelize.query(
    "SELECT * FROM case_orders WHERE patient_id = ? AND status = ? AND doctor_id = ?",
    {
      type: QueryTypes.SELECT,
      replacements: [patientId, "pending", doctorId],
    }
  );
  return pendingCase[0];
};

exports.getWaitingPt = async (patientId) => {
  const waitCase = await sequelize.query(
    "SELECT * FROM wait_cases WHERE status = ? AND patient_id = ?",
    {
      type: QueryTypes.SELECT,
      replacements: ["waiting", patientId],
    }
  );
  return waitCase[0];
};

exports.createData = async (db_name, db_input) => {
  const dataObj = await db_name.create(db_input);
  return dataObj;
};

exports.updateData = async (db_name, db_update, option) => {
  const dataObj = await db_name.update(db_update, option);
  return dataObj;
};

exports.checkExistRow = async (id, db_check) => {
  const result = await db_check.findOne({
    where: { caseId: id },
  });
  return result ? true : false;
};

exports.createDiagList = (db_diag, db_tx, db_update_array, caseId) => {
  db_update_array.forEach(async (element) => {
    if (this.checkExistRow(caseId, db_diag)) {
      await db_diag.update(
        {
          diagName: element.diagName,
        },
        { where: { caseId } }
      );

      element?.diagTx?.forEach(async (item) => {
        await db_tx.update(
          {
            txTitle: item.txTitle,
            txType: item.txType,
            txDetail: item.txDetail,
          },
          { where: { caseId } }
        );
      });
    } else {
      const newDiag = await db_diag.create({
        diagName: element.diagName,
        caseId,
      });

      element?.diagTx?.forEach(async (item) => {
        await db_tx.create({
          txTitle: item.txTitle,
          txType: item.txType,
          txDetail: item.txDetail,
          diagId: newDiag.id,
        });
      });
    }
  });
};

exports.createList = (db_name, db_list, caseId) => {
  db_list.forEach(async (item) => {
    await db_name.create(db_name, { ...item, caseId });
  });
};

exports.deleteRow = async (rowId, db_name) => {
  await db_name.destroy({ where: { id: rowId } });
};
