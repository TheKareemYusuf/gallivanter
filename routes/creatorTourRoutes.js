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

router
  .route("/:tourId")
  .get(
    passport.authenticate("jwt", { session: false }),
    tourController.getACreatorTour
  )
  .put(
    passport.authenticate("jwt", { session: false }),
    tourController.updateTour
  )
  .patch(
    passport.authenticate("jwt", { session: false }),
    tourController.updateTourState
  )

  router
  .route("/:tourId/members")
  .get(
    passport.authenticate("jwt", { session: false }),
    tourController.getTourRegMembers
  )
//   .delete(
//     passport.authenticate("jwt", { session: false }),
//     restrictToMW.restrictTo("admin"),
//     questionController.deleteQuestion
//   );

module.exports = router;
