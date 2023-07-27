exports.createNewCase = async (input) => {
  const CreateCase = await CaseOrder.create({
    location: input.location,
    status: "pending",
    chiefComplaintId: input.ccId,
    doctorId: input.doctorId,
    patientId: input.patientId,
  });
  return CreateCase;
};
