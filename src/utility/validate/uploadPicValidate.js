const fs = require("fs");

exports.validateUploadPic = (fileCheck) => {
  const errors = [];

  //validate file types and sizes
  fileCheck.forEach((file) => {
    const allowedTypes = ["image/jpeg", "image/png"];
    const maxSize = 5 * 1024 * 1024; //5MB

    if (!allowedTypes.includes(file.mimetype)) {
      errors.push(`Invalid file type : ${file.originalname}`);
    }

    if (file.size > maxSize) {
      errors.push(`File too large : ${file.originalname}`);
    }
  });

  return errors;
};

exports.removeErrorPic = (res, errors, files) => {
  //handle validation errors
  if (errors.length > 0) {
    //remove uploaded files
    files.forEach((file) => {
      fs.unlinkSync(file.path);
    });
    return res.status(400).json({ errors });
  }
  return files;
};
