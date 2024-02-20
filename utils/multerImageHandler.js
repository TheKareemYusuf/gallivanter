const multer = require("multer");
const AppError = require('./appError');

// const multerStorage = multer.memoryStorage();

const multerStorage = multer.memoryStorage();


const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const uploadPicture = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

module.exports = uploadPicture;
