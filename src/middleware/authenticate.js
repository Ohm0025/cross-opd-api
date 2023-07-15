const jwt = require("jsonwebtoken");

const AppError = require("../utility/appError");

module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.header;
    if (!authorization || !authorization.startWith("Bearer")) {
      throw new AppError("unauthenticated", 401);
    }

    const token = authorization.split(" ")[1];

    if (!token) {
      throw new AppError("unauthenticated", 401);
    }
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY || "private_key"
    );
  } catch (err) {}
};
