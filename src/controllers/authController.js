const { DOCTOR, PATIENT } = require("../config/constants");
const { UserDoctor } = require("../models");
const { validateLogin } = require("../utility/validateLogin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const genToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET_KEY || "private_key", {
    expiresIn: process.env.JWT_EXPIRES || "1d",
  });

exports.register = async (req, res, next) => {
  try {
    const { typeaccount } = req.params;
    if (typeaccount === DOCTOR) {
      const { firstName, lastName, email, password, mdId } = req.body;

      validateLogin(req.body);
      const hashedPassword = await bcrypt.hash(password, 10);
      const userdoctor = await UserDoctor.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        mdId,
      });
      const token = genToken({ id: userdoctor.id, userdoctor });
      return res.status(201).json({ token });
    }
    if (typeaccount === PATIENT) {
      const { firstName, lastName, email, password, citizenId } = req.body;
      validateLogin(req.body);
      const hashedPassword = await bcrypt.hash(password, 10);
      const userpatient = await UserDoctor.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        citizenId,
      });
      const token = genToken({ id: userpatient.id });
      return res.status(201).json({ token });
    }
    res.status(400).json({ message: "not found page" });
  } catch (err) {
    next(err);
  }
};
