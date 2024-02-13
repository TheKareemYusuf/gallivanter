const Question = require("./../models/questionModel");
const AppError = require("../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");

// Get all questions
const checkAnswer = async (req, res, next) => {
  try {
    // grab the id of the person hitting the route from req.body
    const id = req.body.questionId;
    const answer = req.body.answer
    // use the id to query the database to get role
    const question = await Question.findById(id);

    if (!question) {
      return next(new AppError("Question not found", 404));
    }

    

    res.status(200).json({
      status: "success",
      data: {
        question,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkAnswer,
};
