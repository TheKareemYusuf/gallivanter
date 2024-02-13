const express = require("express");
const passport = require("passport");
const subjectController = require("./../controllers/subjectController");
const SubjectValidationMW = require("./../validators/subject.validator");
const restrictToMW = require("./../authentication/restrictionHandler");

const router = express.Router();

router
  .route("/")
//   .get(
//     passport.authenticate("jwt", { session: false }),
//     questionController.getAllQuestions
//   )
  .post(
    passport.authenticate("jwt", { session: false }),
    restrictToMW.restrictTo('admin'),
    SubjectValidationMW,
    subjectController.createSubject
  );

// router
//   .route("/:id")
//   .get(
//     passport.authenticate("jwt", { session: false }),
//     questionController.getQuestion
//   )
//   .put(
//     passport.authenticate("jwt", { session: false }),
//     // restrictToMW.restrictTo('admin'),
//     questionController.updateQuestion
//   )
//   .patch(
//     passport.authenticate("jwt", { session: false }),
//     restrictToMW.restrictTo("admin"),
//     questionController.updateQuestionState
//   )
//   .delete(
//     passport.authenticate("jwt", { session: false }),
//     restrictToMW.restrictTo("admin"),
//     questionController.deleteQuestion
//   );

module.exports = router;
