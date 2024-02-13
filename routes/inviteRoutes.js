const express = require("express");
// const express = require("express");
const passport = require("passport");
const inviteController = require("./../controllers/inviteController");
const restrictToMW = require("./../authentication/restrictionHandler");

const router = express.Router();

router
  .route("/")
  .post(
    passport.authenticate("jwt", { session: false }),
    restrictToMW.restrictTo("admin"),
    inviteController.generateInviteLink
  );
router
  .route("/verify/:token")
  .get(inviteController.getInviteEmail)
  .post(inviteController.verifyInviteLink);

module.exports = router;
