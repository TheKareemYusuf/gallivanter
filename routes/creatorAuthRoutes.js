const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const CONFIG = require("./../config/config");
const AppError = require("../utils/appError");

const authRouter = express.Router();

const CreatorValidationMW = require("./../validators/creator.validation");

authRouter.post(
  "/signup",
  CreatorValidationMW,
  passport.authenticate("creator-signup", { session: false }),
  async (req, res, next) => {
    const body = {
      _id: req.user._id,
      email: req.user.email,
      firstName: req.user.firstName,
    };
    const token = jwt.sign({ user: body }, CONFIG.SECRET_KEY, {
      expiresIn: "12h",
    });

    // Remove password from output
    req.user.password = undefined;

    res.status(200).json({
      status: "success",
      message: "Signup successful",
      user: req.user,
      token,
    });
  }
);

authRouter.post("/login", async (req, res, next) => {
  passport.authenticate("creator-login", async (err, user, info) => {
    try {
      if (err) {
        return next(err);
      }
      if (!user) {
        const error = new AppError("Username or password is incorrect", 504);
        return next(error);
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        const body = {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
        };
        const token = jwt.sign({ user: body }, CONFIG.SECRET_KEY, {
          expiresIn: "12h",
        });

        return res.status(200).json({
          status: "success",
          message: "Login successful",
          firstName: user.firstName,
          email: user.email,
          role: user.role,
          token,
        });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

module.exports = authRouter;
