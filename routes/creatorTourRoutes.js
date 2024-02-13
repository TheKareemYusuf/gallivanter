const express = require("express");
const passport = require("passport");
const tourController = require("../controllers/tourController");
const TourValidationMW = require("../validators/tour.validator");
const restrictToMW = require("../authentication/restrictionHandler");

const router = express.Router();

router
  .route("/")
  .get(
    passport.authenticate("jwt", { session: false }),
    tourController.getCreatourTours
  )
  .post(
    passport.authenticate("jwt", { session: false }),
    // questionController.uploadQuestionPicture,
    // questionController.resizeQuestionPicture,
    TourValidationMW,
    tourController.createTour
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
