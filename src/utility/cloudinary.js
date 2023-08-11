const cloudinary = require("../config/cloudinary");

exports.upload = async (path, publicId) => {
  const option = {
    use_filename: true,
    overwrite: true,
    unique_filename: false,
  };
  if (publicId) {
    option.public_id = publicId;
  }
  const result = await cloudinary.uploader.upload(path, option);
  return result.secure_url;
};

exports.getPublicId = (url) => {
  return url.split("/")[url.split("/").length - 1].split(".")[0];
};
