const express = require("express");
const passport = require("passport");
const userController = require("./../controllers/userController");
const activityController = require("./../controllers/activityController");
const checkAnswerController = require('./../controllers/checkAnswerController');
const UserValidationMW = require("./../validators/user.validation");
// const restrictToMW = require("./../authentication/restrictionHandler");

const router = express.Router();

router.route("/check-answer").post(
  passport.authenticate("jwt", { session: false }),
  checkAnswerController.checkAnswer
)

router
  .route("/update-profile")
  .patch(
    UserValidationMW,
    passport.authenticate("jwt", { session: false }),
    userController.updateUserProfile
  );



module.exports = router;
