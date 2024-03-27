const express = require("express");
const passport = require("passport");
const creatorController = require("./../controllers/creatorController");
const CreatorValidationMW = require("./../validators/creator.validation");
const restrictToMW = require("./../authentication/restrictionHandler");

const router = express.Router();



router
  .route("/")
  .get(
    passport.authenticate("jwt", { session: false }),
    creatorController.getProfile
  )
  .patch(
    CreatorValidationMW,
    passport.authenticate("jwt", { session: false }),
    creatorController.updateCreatorProfile

  );

//   router.route("/update-profile-picture").patch(
//     passport.authenticate("jwt", { session: false }),
//     creatorController.uploadCreatorPicture,
//     creatorController.uploadCreatorProfilePicture
//   );

// router
//   .route("/question-stats")
//   .get(
//     passport.authenticate("jwt", { session: false }),
//     creatorController.getCreatorQuestionStats  )

// router
//   .route("/add-subject")
//   .put(
//     CreatorValidationMW,
//     passport.authenticate("jwt", { session: false }),
//     creatorController.addSubjectByCreator
//   );

// router
//   .route("/")
//   .get(
//     passport.authenticate("jwt", { session: false }),
//     restrictToMW.restrictTo("admin"),
//     creatorController.getAllCreators
//   )
//   .post(
//     CreatorValidationMW,
//     passport.authenticate("jwt", { session: false }),
//     creatorController.createCreator
//   );

// router
//   .route("/:id")
//   .get(
//     passport.authenticate("jwt", { session: false }),
//     restrictToMW.restrictTo("admin"),
//     creatorController.getCreator
//   )
//   .patch(
//     passport.authenticate("jwt", { session: false }),
//     restrictToMW.restrictTo("admin"),
//     creatorController.updateCreatorStatus
//   )
//   .delete(
//     passport.authenticate("jwt", { session: false }),
//     restrictToMW.restrictTo("admin"),
//     creatorController.deleteCreator
//   );

module.exports = router;
