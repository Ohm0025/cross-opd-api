const { sequelize } = require("../../models");
const { QueryTypes, Op } = require("sequelize");
const { changeTimeZone } = require("../../utility/formatData/formatTime");

exports.getPendingCase = async (patientId, doctorId) => {
  // let today = changeTimeZone(new Date(), "Asia/Bangkok");
  let today = new Date();
  let day = 60 * 60 * 24 * 1000;
  let tomorrow = new Date(today.getTime() + day);
  let yesterday = new Date(today.getTime() - day);
  const pendingCase = await sequelize.query(
    "SELECT * FROM case_orders WHERE patient_id = ? AND status = ? AND doctor_id = ? AND created_at BETWEEN ? AND ?",
    {
      type: QueryTypes.SELECT,
      replacements: [patientId, "pending", doctorId, yesterday, tomorrow],
    }
  );
  return pendingCase[0];
};

exports.getWaitingPt = async (patientId) => {
  const waitCase = await sequelize.query(
    "SELECT * FROM wait_cases WHERE (status = ? OR status = ?) AND patient_id = ?",
    {
      type: QueryTypes.SELECT,
      replacements: ["waiting", "inprogress", patientId],
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
    where: { [Op.or]: [{ caseId: id }] },
  });

  return result ? true : false;
};

exports.createDiagList = async (
  db_diag,
  db_tx,
  db_update_array,
  caseId,
  detailDrug,
  detailProcedure
) => {
  await db_diag.destroy({ where: { caseId } });

  db_update_array.forEach(async (item1) => {
    await db_diag.create({
      diagName: item1,
      caseId,
    });

    const selectedDiag = await db_diag.findOne({
      where: { [Op.and]: [{ caseId }, { diagName: item1 }] },
    });

    selectedDiag &&
      (await db_tx.destroy({ where: { diagId: selectedDiag?.id } }));

    detailDrug.forEach(async (item2) => {
      if (item1 === item2.diagTitle) {
        await db_tx.create({
          txTitle: item2.title,
          txType: "drug",
          txDetail: item2.use + " " + item2.amount,
          diagId: selectedDiag?.id,
        });
      }
    });
    detailProcedure.forEach(async (item2) => {
      if (item1 === item2.diagTitle) {
        await db_tx.create({
          txTitle: item2.proceduce,
          txType: "proceduce",
          txDetail: item2.procedist,
          diagId: selectedDiag.id,
        });
      }
    });

    console.log("create diag");
  });
};

exports.createLabList = (db_name, db_list, caseId) => {
  if (this.checkExistRow(caseId, db_name)) {
    db_list.forEach(async (item) => {
      await db_name.update(
        {
          labName: item.name,
          labStatus: item.status,
          labDescript: item.des,
          labImg: "",
        },
        {
          where: { case_id: caseId },
        }
      );
    });
  } else {
    db_list.forEach(async (item) => {
      await db_name.create({
        labName: item.name,
        labStatus: item.status,
        labDescript: item.des,
        labImg: "",
        case_id: caseId,
      });
    });
  }
};

exports.createImgList = (db_name, db_list, caseId) => {
  if (this.checkExistRow(caseId, db_name)) {
    db_list.forEach(async (item) => {
      await db_name.update(
        {
          imgName: item.name,
          imgStatus: item.status,
          imgDescript: item.des,
          imgImg: "",
        },
        {
          where: { caseId },
        }
      );
    });
  } else {
    db_list.forEach(async (item) => {
      await db_name.create({
        imgName: item.name,
        imgStatus: item.status,
        imgDescript: item.des,
        imgImg: "",
        caseId,
      });
    });
  }
};

exports.deleteRow = async (rowId, db_name) => {
  await db_name.destroy({ where: { id: rowId } });
};
