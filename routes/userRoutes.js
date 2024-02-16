const express = require("express");
const passport = require("passport");
const userController = require("./../controllers/userController");
const UserValidationMW = require("./../validators/user.validation");
const restrictToMW = require("./../authentication/restrictionHandler");

const router = express.Router();

// router
//   .route("/update-profile")
//   .put(
//     passport.authenticate("jwt", { session: false }),
//     userController.updateUserProfile
//   );

router
  .route("/")
  .get(
    passport.authenticate("jwt", { session: false }),
    // restrictToMW.restrictTo("admin"),
    userController.getUserProfile
  )
  .patch(
    UserValidationMW,
    passport.authenticate("jwt", { session: false }),
    userController.updateUserProfile
  );

// router
//   .route("/:id")
//   .get(
//     passport.authenticate("jwt", { session: false }),
//     restrictToMW.restrictTo("admin"),
//     userController.getUser
//   )
  // .put(
  //   UserValidationMW,
  //   passport.authenticate("jwt", { session: false }),
  //   restrictToMW.restrictTo("admin"),
  //   userController.updateUserProfile
  // )
  // .patch(
  //   UserValidationMW,
  //   passport.authenticate("jwt", { session: false }),
  //   restrictToMW.restrictTo("admin"),
  //   userController.updateUserStatus
  // )
  // .delete(
  //   passport.authenticate("jwt", { session: false }),
  //   restrictToMW.restrictTo("admin"),
  //   userController.deleteUser
  // );

module.exports = router;
