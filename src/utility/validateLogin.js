const AppError = require("../utility/appError");
const validator = require("validator");

exports.validateLogin = (obj) => {
  const { firstName, lastName, email, password, confirmpass, mdId, citizenId } =
    obj;
  //validate data
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
};
