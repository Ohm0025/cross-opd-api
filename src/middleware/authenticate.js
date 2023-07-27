const jwt = require("jsonwebtoken");

const AppError = require("../utility/appError");
const { DOCTOR, PATIENT } = require("../config/constants");
const { UserDoctor, UserPatient } = require("../models");

module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer")) {
      throw new AppError("unauthenticated no bearer", 401);
    }

    const token = authorization.split(" ")[1];

    if (!token) {
      throw new AppError("unauthenticated no token", 401);
    }
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY || "private_key"
    );
    if (payload.typeaccount === DOCTOR) {
      const userdoctor = await UserDoctor.findOne({
        where: { id: payload.id },
        attributes: { exclude: ["password"] },
      });
      if (!userdoctor) {
        throw new AppError("unauthenticated", 401);
      }
      req.user = userdoctor;
      req.typeaccount = DOCTOR;
    } else if (payload.typeaccount === PATIENT) {
      const userpatient = await UserPatient.findOne({
        where: { id: payload.id },
        attributes: { exclude: ["password"] },
      });
      if (!userpatient) {
        throw new AppError("unauthenticated patient", 401);
      }
      req.user = userpatient;
      req.typeaccount = PATIENT;
    }
    next();
  } catch (err) {
    next(err);
  }
};
