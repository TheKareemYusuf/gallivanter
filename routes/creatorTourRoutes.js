const express = require("express");
const passport = require("passport");
const tourController = require("../controllers/tourController");
const TourValidationMW = require("../validators/tour.validator");
const restrictToMW = require("../authentication/restrictionHandler");
const itineraryController = require("../controllers/itineraryController");

const router = express.Router();

router
  .route("/")
  .get(
    passport.authenticate("jwt", { session: false }),
    tourController.getCreatourTours
  )
  .post(
    passport.authenticate("jwt", { session: false }),
    // tourController.uploadTourPicture,
    // questionController.resizeQuestionPicture,
    TourValidationMW,
    tourController.createTour
  );

router
  .route("/members")
  .get(
    passport.authenticate("jwt", { session: false }),
    tourController.getCreatorToursRegMembers
  );

router
  .route("/images")
  .post(
    // passport.authenticate("jwt", { session: false }),
    tourController.uploadMultiplePictures,
    tourController.uploadImages
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
  );

router
  .route("/:tourId/members")
  .get(
    passport.authenticate("jwt", { session: false }),
    tourController.getTourRegMembers
  );

router
  .route("/:tourId/itinerary")
  .post(
    passport.authenticate("jwt", { session: false }),
    itineraryController.createItinerary
  )
  .get(
    passport.authenticate("jwt", { session: false }),
    itineraryController.getALlItinerary
  );

router
  .route("/:tourId/itinerary/:itineraryId")
  .get(
    passport.authenticate("jwt", { session: false }),
    itineraryController.getOneItinerary
  )
  .put(
    passport.authenticate("jwt", { session: false }),
    itineraryController.updateItinerary
  )
  .delete(
    passport.authenticate("jwt", { session: false }),
    itineraryController.deleteItinerary
  );

router
  .route("/:tourId/upload-images")
  .patch(
    passport.authenticate("jwt", { session: false }),
    tourController.uploadMultiplePictures,
    tourController.addImages
  );
//   .delete(
//     passport.authenticate("jwt", { session: false }),
//     restrictToMW.restrictTo("admin"),
//     questionController.deleteQuestion
//   );

module.exports = router;
