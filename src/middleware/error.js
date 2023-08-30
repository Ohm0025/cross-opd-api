module.exports = (err, req, res, next) => {
  console.log(err);

  if (err.name === "SequelizeUniqueConstraintError") {
    err.statusCode = 400;
    if (err.errors[0].message === "citizen_id must be unique") {
      err.message = "this citizen id has been used.";
    }
    if (err.errors[0].message === "email must be unique") {
      err.message = "this email has been used.";
    }
  }

  if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
    err.statusCode = 401;
    err.message = "login expired.";
  }

  res.status(err.statusCode || 500).json({ message: err.message });
};
