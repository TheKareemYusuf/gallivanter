const Tour = require("../models/tourModel");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");
const Creator = require("../models/creatorModel");
const uploadPicture = require("../utils/multerImageHandler");
// const multer = require("multer");
// const sharp = require("sharp");

//-----------------------------------------------------

const createTour = async (req, res, next) => {
  try {

    const id = req.user._id;
    const user = await Creator.findById(id);
    if(!user) {
      return next(new AppError("Only creator can create tours", 404))
    }
  
    const {
      title,
      description,
      numOfDays,
      price,
      maxCapacity,
      tags,
      startDate,
      endDate,
    } = req.body;

    // let imageData = { }

    // if (req.file) {
    //   const imageBuffer = req.file.buffer
    //   const data = await uploadToCloudinary(imageBuffer, "question-images");
    //   imageData = data
    // }

    const newTour = await Tour.create({
      title,
      description,
      numOfDays,
      price,
      maxCapacity,
      tags,
      startDate,
      endDate,
      // questionImageUrl: imageData.url,
      // questionImagePublicId: imageData.public_id,
      creatorName: req.user.firstName, // Change to business name
      creatorId: req.user._id,
    });

    res.status(201).json({
      status: "success",
      message: "Tour created successfully",
      data: newTour,
    });
  } catch (error) {
    next(error);
  }
};

// Get all tours
const getAllPublicTours = async (req, res, next) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

    res.status(200).json({
      status: "success",
      result: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get single question
const getAPublicTour = async (req, res, next) => {
  try {
    const id = req.params.tourId;
    const tour = await Tour.findById(id);

    if (!tour) {
      return next(new AppError("Tour not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getCreatourTours = async (req, res, next) => {
  try {

     // grab the id of the person hitting the route from req.body
    const id = req.user._id;
    // use the id to query the database to get role
    const user = await Creator.findById(id);
    if(!user) {
      return next(new AppError("Creator not found", 404))
    } else {
      const features = new APIFeatures(Tour.find().where("creatorId").equals(id), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

    res.status(200).json({
      status: "success",
      result: tours.length,
      data: {
        tours,
      },
    });
    }

    
  } catch (error) {
    next(error);
  }
};

const getACreatorTour = async (req, res, next) => {
  try {
    const id = req.params.tourId;
    const tour = await Tour.findById(id);
     // grab the id of the person hitting the route from req.body
     const creatorId = req.user._id;
     // use the id to query the database to get role
     const user = await Creator.findById(id);
     
    if (!user) {
      return next(new AppError("Creator not found", 404));
    }

    if (!tour) {
      return next(new AppError("Tour not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (error) {
    next(error);
  }
};

// const getAllTours = async (req, res, next) => {
//   try {
//     // grab the id of the person hitting the route from req.body
//     const id = req.user._id;
//     // use the id to query the database to get role
//     const user = await Creator.findById(id);

//     // console.log(user.role);
//     if (user.role === "creator") {
//       // const questions = await Question.find().where("creatorId").equals(id);

//       const features = new APIFeatures(
//         Question.find().where("creatorId").equals(id),
//         req.query
//       )
//         .filter()
//         .sort()
//         .limitFields()
//         .paginate();

//       const questions = await features.query;

//       res.status(200).json({
//         status: "success",
//         result: questions.length,
//         data: {
//           questions,
//         },
//       });
//     } else {
//       const features = new APIFeatures(Question.find(), req.query)
//         .filter()
//         .sort()
//         .limitFields()
//         .paginate();
//       const questions = await features.query;

//       res.status(200).json({
//         status: "success",
//         result: questions.length,
//         data: {
//           questions,
//         },
//       });
//     }
//   } catch (error) {
//     next(error);
//   }
// };

module.exports = {
  createTour,
  getAllPublicTours,
  getAPublicTour,
  getCreatourTours
};

//-----------------------------------------------------
// const {
//   uploadToCloudinary,
//   removeFromCloudinary,
// } = require("./../utils/cloudinary");

// const uploadQuestionPicture = uploadPicture.single("questionImage");

// // const resizeQuestionPicture = async (req, res, next) => {
// //   if (!req.file) return next();

// //   req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

// //   await sharp(req.file.buffer)
// //     .resize(500, 500)
// //     .toFormat("jpeg")
// //     .jpeg({ quality: 90 })
// //     .toFile(`public/${req.file.filename}`);

// //   next();
// // };

// const createQuestion = async (req, res, next) => {
//   try {
//     const {
//       question,
//       answerOptions,
//       subject,
//       topic,
//       correctAnswer,
//       questionImageUrl,
//       mode,
//     } = req.body;

//     let imageData = { }

//     if (req.file) {
//       const imageBuffer = req.file.buffer
//       const data = await uploadToCloudinary(imageBuffer, "question-images");
//       imageData = data
//     }

//       const newQuestion = await Question.create({
//         question,
//         questionImageUrl: imageData.url,
//         questionImagePublicId: imageData.public_id,
//         answerOptions,
//         subject,
//         topic,
//         correctAnswer,
//         creatorName: req.user.firstName,
//         creatorId: req.user._id,
//         mode,
//       });

//       res.status(201).json({
//         status: "success",
//         message: "Question created successfully",
//         data: newQuestion,
//       });
//     } catch (error) {
//     next(error);
//   }
// };

// // Get all questions
// const getAllQuestions = async (req, res, next) => {
//   try {
//     // grab the id of the person hitting the route from req.body
//     const id = req.user._id;
//     // use the id to query the database to get role
//     const user = await Creator.findById(id);

//     // console.log(user.role);
//     if (user.role === "creator") {
//       // const questions = await Question.find().where("creatorId").equals(id);

//       const features = new APIFeatures(
//         Question.find().where("creatorId").equals(id),
//         req.query
//       )
//         .filter()
//         .sort()
//         .limitFields()
//         .paginate();

//       const questions = await features.query;

//       res.status(200).json({
//         status: "success",
//         result: questions.length,
//         data: {
//           questions,
//         },
//       });
//     } else {
//       const features = new APIFeatures(Question.find(), req.query)
//         .filter()
//         .sort()
//         .limitFields()
//         .paginate();
//       const questions = await features.query;

//       res.status(200).json({
//         status: "success",
//         result: questions.length,
//         data: {
//           questions,
//         },
//       });
//     }
//   } catch (error) {
//     next(error);
//   }
// };

// // Get single question
// const getQuestion = async (req, res, next) => {
//   try {
//     const id = req.params.id;
//     const question = await Question.findById(id);

//     if (!question) {
//       return next(new AppError("Question with the ID not found", 404));
//     }

//     res.status(200).json({
//       status: "success",
//       data: {
//         question,
//       },
//     });
//   } catch (error) {
//     next(error.message);
//   }
// };

// // This will be reserved for super admin
// const updateQuestionState = async (req, res, next) => {
//   try {
//     let state = req.body.state;
//     const id = req.params.id;

//     const oldQuestion = await Question.findById(id);

//     // Checking if the user attempting to update is the author
//     // if (req.user._id.toString() !== oldQuestion.creatorId._id.toString()) {
//     //   return next(
//     //     new AppError("You cannot edit as you're not the author", 403)
//     //   );
//     // }

//     if (req.user.role !== "admin") {
//       return new AppError("You are not authorized", 403);
//     }

//     if (
//       !(
//         state &&
//         (state.toLowerCase() === "pending" ||
//           state.toLowerCase() === "approved" ||
//           state.toLowerCase() === "rejected")
//       )
//     ) {
//       return new AppError("Please provide a valid state", 400);
//     }

//     const question = await Question.findByIdAndUpdate(
//       id,
//       { state: state.toLowerCase() },
//       { new: true, runValidators: true, context: "query" }
//     );

//     if (!question) {
//       return next(new AppError("Question not found", 404));
//     }

//     res.status(200).json({
//       status: "success",
//       data: question,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// const updateQuestion = async (req, res, next) => {
//   try {
//     let questionUpdate = { ...req.body };
//     const id = req.params.id;

//     if (questionUpdate.state) delete questionUpdate.state;

//     const oldQuestion = await Question.findById(id);

//     if (req.user.role === "creator") {
//       if (req.user._id.toString() !== oldQuestion.creatorId._id.toString()) {
//         return next(
//           new AppError("You cannot edit as you're not the author", 403)
//         );
//       }
//     }

//     const question = await Question.findByIdAndUpdate(id, questionUpdate, {
//       new: true,
//       runValidators: true,
//       context: "query",
//     });

//     if (!question) {
//       return next(new AppError("Question not found", 404));
//     }

//     res.status(200).json({
//       status: "success",
//       message: "Question updated successfully",
//       data: questionUpdate,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// const deleteQuestion = async (req, res, next) => {
//   try {
//     const id = req.params.id;
//     const oldQuestion = await Question.findById(id);

//     if (!oldQuestion) {
//       return next(new AppError("Question not found", 404));
//     }

//     // Checking if the user attempting to delete is the author
//     // if (req.user._id.toString() !== oldQuestion.creatorId._id.toString()) {
//     //   return next(
//     //     new AppError("You cannot delete as you're not the author", 403)
//     //   );
//     // }

//     await Question.findByIdAndRemove(id);

//     res.status(200).json({
//       status: "question successfully deleted",
//       data: null,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// module.exports = {
//   getAllQuestions,
//   getQuestion,
//   createQuestion,
//   updateQuestion,
//   updateQuestionState,
//   deleteQuestion,
//   uploadQuestionPicture,
// };
