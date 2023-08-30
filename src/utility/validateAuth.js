const { DOCTOR, PATIENT } = require("../config/constants");
const { UserDoctor, UserPatient } = require("../models");
const AppError = require("./appError");
const validator = require("validator");

const bcrypt = require("bcryptjs");

exports.validateRegistrer = (obj) => {
  const {
    firstName,
    lastName,
    email,
    password,
    confirmpass,
    numId,
    typeaccount,
  } = obj;
  //validate general data
  if (!email) {
    throw new AppError("email is required.", 400);
  }
  const isEmail = validator.isEmail(email);
  if (!isEmail) {
    throw new AppError("email address is invalid format.");
  }
  if (!password) {
    throw new AppError("password is required.", 400);
  }
  if (password !== confirmpass) {
    throw new AppError("password and confirm password did not match.", 400);
  }

  //validate id
  if (!numId) {
    const ErrorMessage = typeaccount === DOCTOR ? "mdID" : "citizenID";
    throw new AppError(`${ErrorMessage} is required.`, 400);
  }
};

exports.validateLogin = async (typeaccount, email, password) => {
  if (!email) {
    throw new AppError("email is required.", 400);
  } else if (!validator.isEmail(email)) {
    throw new AppError("email is invalid format.", 400);
  }
  if (!password) {
    throw new AppError("password is required,", 400);
  }
  if (typeaccount === DOCTOR) {
    const userdoctor = await UserDoctor.findOne({ where: { email } });
    if (!userdoctor) {
      throw new AppError("email is incorrect or no this user", 400);
    }
    const isCorrect = await bcrypt.compare(password, userdoctor.password);
    if (!isCorrect) {
      throw new AppError("password is incorrect.", 400);
    }
  } else if (typeaccount === PATIENT) {
    const userpatient = await UserPatient.findOne({ where: { email } });
    if (!userpatient) {
      throw new AppError("email is incorrect or no this user", 400);
    }
    const isCorrect = await bcrypt.compare(password, userpatient.password);
    if (!isCorrect) {
      throw new AppError("password is incorrect.", 400);
    }
  }
};
