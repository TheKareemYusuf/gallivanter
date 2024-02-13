const express = require("express");
const tourController = require("../controllers/tourController");

const router = express.Router();

router.route("/").get(tourController.getAllPublicTours)

router.route("/:tourId").get(tourController.getAPublicTour);
//   .post(
//     passport.authenticate("jwt", { session: false }),
//     // questionController.uploadQuestionPicture,
//     // questionController.resizeQuestionPicture,
//     TourValidationMW,
//     tourController.createTour
//   );

module.exports = router;
