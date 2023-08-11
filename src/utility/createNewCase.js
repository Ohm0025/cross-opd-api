const { CaseOrder, ChiefComplaint } = require("../models");

exports.createNewCase = async (input) => {
  const newCC = await ChiefComplaint.create({
    title: input.cc,
  });
  const newCase = await CaseOrder.create({
    location: input.location,
    status: "pending",
    chiefComplaintId: newCC.id,
    doctorId: input.doctorId,
    patientId: input.patientId,
  });
  return { newCase, newCC };
};
