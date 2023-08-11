exports.findUserInWaitList = async (patientId, WaitCase, UserPatient) => {
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
