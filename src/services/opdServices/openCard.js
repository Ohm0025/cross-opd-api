const { Op } = require("sequelize");
const { changeTimeZone } = require("../../utility/formatData/formatTime");

exports.findUserInWaitList = async (
  patientId,
  WaitCase,
  UserPatient,
  CaseOrder
) => {
  //let today = changeTimeZone(new Date(), "Asia/Bangkok");
  let today = new Date();
  let day = 60 * 60 * 24 * 1000;
  let tomorrow = new Date(today.getTime() + day);
  let yesterday = new Date(today.getTime() - day);

  const userPending = await CaseOrder?.findOne({
    where: {
      patientId,
      status: "pending",
      createdAt: { [Op.between]: [yesterday, tomorrow] },
    },
  });

  if (userPending) {
    return userPending;
  }

  const userWait = await WaitCase.findOne({
    where: { patientId },
    include: { model: UserPatient, attributes: { exclude: "password" } },
  });

  return userWait;
};

exports.createNewWaitCase = async (inputObj, WaitCase) => {
  const waitCase = await WaitCase.create(inputObj);
  return waitCase;
};
