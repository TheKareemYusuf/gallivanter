const Question = require("./../models/questionModel");
const Bucket = require("./../models/bucketModel");

const AppError = require("../utils/appError");

// 

const checkAnswer = async (req, res, next) => {
  try {
    const { questionId, answer } = req.body;
    const userId = req.user._id;

    const question = await Question.findById(questionId);

    if (!question) {
      return next(new AppError("Question not found", 404));
    }

    const subject = question.subject;

    if (!question.answerOptions.includes(answer)) {
      return next(new AppError("Answer not found", 404));
    }

    const feedback = answer === question.correctAnswer ? "Correct! ✔" : "Wrong! ❌";

    // Save user ID, subject, and question ID to the Bucket model
    const bucket = await Bucket.findOneAndUpdate(
      { userId, subject },
      { $push: { questionsAnswered: questionId } },
      { new: true, upsert: true }
    );

    console.log(bucket);

    res.status(200).json({
      status: "success",
      feedback,
      data: {
        bucket,
      },
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  checkAnswer,
};
