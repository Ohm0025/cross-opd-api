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
