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

// ------------------------------------------------
// const multer = require("multer");
// const AppError = require('./appError');

// const multerStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads'); // Destination folder for uploaded files
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname); // Keep original file name
//   }
// });

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

const multer = require('multer');
const { uploadPath } = require("./../config/config");
const AppError = require('./appError');

const VALID_IMAGE_FORMATS = {
  PNG: 'png',
  JPG: 'jpg',
  JPEG: 'jpeg',
  GIF: 'gif',
}
const expectedMimeTypes = {
  'image/jpeg': true,
  'image/png': true,
  'image/gif': true,
  'image/svg': true,
  'image/tiff': true,
  'image/webp': true,
};

const storage = multer.diskStorage({
  destination: uploadPath,
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

const uploadPicture = multer({
  storage,
  // limits: {
  //   files: 4,
  //   fileSize: 1024 * 1024 * 4,
  // },
  fileFilter: (req, file, cb) => {
    try {
      if (expectedMimeTypes[file.mimetype]) {
        cb(null, true);
      } else
        throw new AppError(
          `Please use a valid image format. Valid formats include: ${Object.values(
            VALID_IMAGE_FORMATS
          ).join(', ')}`, 404
        );
    } catch (error) {
      cb(error);
    }
  },
});

module.exports =  uploadPicture;
