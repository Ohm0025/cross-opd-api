const { UserDoctor, UserPatient } = require("../../models");
const jwt = require("jsonwebtoken");
const { DOCTOR, PATIENT } = require("../../config/constants");

const genToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET_KEY || "private_key", {
    expiresIn: process.env.JWT_EXPIRES || "1d",
  });

exports.generateToken = async (typeaccount, email) => {
  let user = {};
  if (typeaccount === DOCTOR) {
    user = await UserDoctor.findOne({ where: { email } });
  }
  if (typeaccount === PATIENT) {
    user = await UserPatient.findOne({ where: { email } });
  }
  const token = genToken({ id: user.id, typeaccount });
  return token;
};
