const { DOCTOR, PATIENT } = require("../config/constants");
const { UserDoctor, UserPatient } = require("../models");
const { validateLogin, validateRegistrer } = require("../utility/validateAuth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../services/authServices/login");

const genToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET_KEY || "private_key", {
    expiresIn: process.env.JWT_EXPIRES || "1d",
  });

exports.register = async (req, res, next) => {
  try {
    const { typeaccount } = req.params;
    const {
      firstName,
      lastName,
      email,
      password,
      confirmpass,
      mdId,
      gender,
      citizenId,
      birthDate,
    } = req.body;

    validateRegistrer({
      typeaccount,
      firstName,
      lastName,
      email,
      password,
      confirmpass,
      gender,
      numId: mdId || citizenId,
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    if (typeaccount === DOCTOR) {
      const userdoctor = await UserDoctor.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        gender,
        mdId,
        birthDate,
      });
      const token = genToken({ id: userdoctor.id, typeaccount });
      return res.status(201).json({ token });
    }
    if (typeaccount === PATIENT) {
      const userpatient = await UserPatient.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        gender,
        citizenId,
        birthDate,
      });
      const token = genToken({ id: userpatient.id, typeaccount });
      return res.status(201).json({ token });
    }
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { typeaccount } = req.params;
    const { email, password } = req.body;

    await validateLogin(typeaccount, email, password);
    const token = await generateToken(typeaccount, email);

    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};

exports.getme = (req, res, next) => {
  try {
    res.status(201).json({ user: req.user, typeaccount: req.typeaccount });
  } catch (err) {
    next(err);
  }
};
