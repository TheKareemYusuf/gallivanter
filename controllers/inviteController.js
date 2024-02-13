const Invite = require("./../models/adminInviteModel");
const Creator = require("./../models/creatorModel");
const AppError = require("./../utils/appError");
const sendEmail = require("./../utils/email");

const generateInviteLink = async (req, res, next) => {
  try {
    // Grab email from the req object
    const userEmail = req.body.email;
    // 1. Get user email from the req object
    const user = await Creator.findOne({ email: userEmail });

    // 2. Check if the user exist in creator database, if true, then return that user exists
    if (user) {
      return next(new AppError("User already exists", 400));
    }

    let invite = await Invite.findOne({ email: userEmail });
    if (invite) {
      return next(new AppError("Invite has already been sent", 400));
    }

    // 3. Save user email to invite database
    invite = new Invite({ email: userEmail });
    await invite.save();

    const inviteURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/creators/invite/verify/${invite.token}`;

    // http://localhost:8000/api/v1

    // 4. Generate invite email and send to user
    const message = `Kindly confirm your invite using this link: ${inviteURL}. \nIf you didn't request an invite mail, please ignore this email!`;
    try {
      await sendEmail({
        email: userEmail,
        subject: "Invitation link",
        message,
      });

      res.status(200).json({
        status: "success",
        message: "Kindly check your email for an invite link!",
      });
    } catch (error) {
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

const getInviteEmail = async (req, res, next) => {
  try {
    console.log({ token: req.params.token });
    const invite = await Invite.findOne({ token: req.params.token });
    if (!invite) {
      return next(new AppError("Token does not exist", 404));
    }
    if (invite.isExpired()) {
      return next(new AppError("Token is expired", 401));
    }

    

    res.status(200).json({
      status: "success",
      message: "kindly fill the form below",
      invite,
    });
  } catch (error) {
    next(error);
  }
};

const verifyInviteLink = async (req, res, next) => {
  try {
    const invite = await Invite.findOne({ token: req.params.token });
    if (!invite) {
      return next(new AppError("Invalid invite link", 404));
    }
    if (invite.isExpired()) {
      await Invite.findByIdAndRemove(invite._id);
      return next(new AppError("Invitation has expired", 401));
    }

    res.status(200).json({
      status: "success",
      message: "Now register",
    });
    // return res.redirect("signup");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateInviteLink,
  getInviteEmail,
  verifyInviteLink,
};
