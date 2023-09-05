exports.findUserInWaitList = async (
  patientId,
  WaitCase,
  CaseOrder,
  UserPatient
) => {
  const userWait =
    (await WaitCase.findOne({
      where: { patientId },
      include: { model: UserPatient, attributes: { exclude: "password" } },
    })) ||
    (await CaseOrder.findOne({
      where: { patientId, status: "pending" },
    }));

  return userWait;
};

exports.createNewWaitCase = async (inputObj, WaitCase) => {
  const waitCase = await WaitCase.create(inputObj);
  return waitCase;
};
