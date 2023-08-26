const fs = require("fs");

exports.testUploadImg = async (req, res, next) => {
  try {
    //handle the uploaded files
    const files = req.files;

    //process and store the files as required
    //for example, save the files to a specific directory using fs module
    files?.forEach((file) => {
      const filePath = `public/images/${file.filename}`;
      fs.rename(file.path, filePath, (err) => {
        if (err) {
          //handle error appropriately and send an error response
          res.status(500).json({ error: "Faile to store the file" });
          return;
        }
      });
    });
    //send an appropriate response to the client
    res.status(201).json({ message: "File upload successful" });
  } catch (err) {
    next(err);
  }
};
