const express = require("express");
const passport = require("passport");
const tourController = require("./../controllers/tourController");

const router = express.Router();

router
  .route("/")
  .get(
    passport.authenticate("jwt", { session: false }),
    tourController.getAllRegTourDetails
  );

router
  .route("/:tourId")
  .get(
    passport.authenticate("jwt", { session: false }),
    tourController.getRegTourDetails
  );

router
  .route("/:tourId/join")
  .post(
    passport.authenticate("jwt", { session: false }),
    tourController.joinATour
  );

module.exports = router;
