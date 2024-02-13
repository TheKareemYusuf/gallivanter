const Question = require("./../models/questionModel");
const AppError = require("../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");
const User = require("./../models/userModel");
const Bucket = require("../models/bucketModel");

// Get all questions
const getAllPracticeQuestions = async (req, res, next) => {
  try {
    // grab the id of the person hitting the route from req.body
    const id = req.user._id;
    // use the id to query the database to get role
    const user = await User.findById(id);

    // console.log(user.role);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    const features = new APIFeatures(
      Question.find()
        .where("mode")
        .equals("practice")
        .where("state")
        .equals("approved"),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const questions = await features.query;

    res.status(200).json({
      status: "success",
      result: questions.length,
      data: {
        questions,
      },
    });
  } catch (error) {
    next(error);
  }
};

// const getPracticeQuestionsBySubject = async (req, res, next) => {
//     try {
//       // Grab the id of the person hitting the route from req.user
//       const userId = req.user._id;
  
//       // Use the id to query the database to get the user's role
//       const user = await User.findById(userId);
//       const subject = req.params.subject;
    
//       if (!user) {
//         return next(new AppError("User not found", 404));
//       }
      
//       // solvedQuestions = Bucket.find().where("userId").equals("id").

//       // const bucket = await Bucket.find({ userId, subject });
//       // console.log(bucket);

//       const limit = 20; // Number of random questions to retrieve
      
//       // Query random questions based on subject and other filters if required
//       const questions = await Question.aggregate([
//         { $match: { mode: "practice", state: "approved", subject: subject } },
//         { $sample: { size: limit } }
//       ]);
  
//       res.status(200).json({
//         status: "success",
//         result: questions.length,
//         data: {
//           questions,
//         },
//       });
//     } catch (error) {
//       next(error);
//     }
//   };

const getPracticeQuestionsBySubject = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    const subject = req.params.subject;

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Find all documents that match the userId and subject
    const buckets = await Bucket.find({ userId, subject });

    let toBeSubtracted = [];

    if (buckets.length > 0) {
      // Combine the questionsAnswered arrays from all the matching documents
      toBeSubtracted = buckets.flatMap(bucket => bucket.questionsAnswered);
    }

    let questions;

    if (toBeSubtracted.length === 0) {
      // User has never practiced the subject before, serve questions based on subject, state, and mode
      questions = await Question.aggregate([
        { $match: { mode: "practice", state: "pending", subject: subject } },
        { $sample: { size: 5 } }
      ]);
    } else {
      // User has practiced the subject before, subtract answered questions from new question query
      questions = await Question.aggregate([
        { $match: { mode: "practice", state: "pending", subject: subject, _id: { $nin: toBeSubtracted } } },
        { $sample: { size: 5 } }
      ]);
    }

    res.status(200).json({
      status: "success",
      result: questions.length,
      data: {
        questions,
      },
    });
  } catch (error) {
    next(error);
  }
};

  
module.exports = {
  getAllPracticeQuestions,
  getPracticeQuestionsBySubject
};
