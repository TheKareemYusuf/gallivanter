// const multer = require("multer");
// const AppError = require('./appError');

// // const multerStorage = multer.memoryStorage();

// const multerStorage = multer.memoryStorage();


// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image")) {
//     cb(null, true);
//   } else {
//     cb(new AppError("Not an image! Please upload only images.", 400), false);
//   }
// }; 

// const uploadPicture = multer({
//   storage: multerStorage,
//   fileFilter: multerFilter,
// });

// module.exports = uploadPicture;

const multer = require("multer");
const AppError = require('./appError');

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Keep original file name
  }
});

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
