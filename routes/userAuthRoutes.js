const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const CONFIG = require("./../config/config");

const authRouter = express.Router();
const userValidationMW = require("./../validators/user.validation");

authRouter.post(
  "/signup",
  userValidationMW,
  passport.authenticate("user-signup", { session: false }),
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
  passport.authenticate("user-login", async (err, user, info) => {
    try {
      if (err) {
        return next(err);
      }
      if (!user) {
        const error = new Error("Username or password is incorrect");
        return next(error);
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        const body = {
          _id: req.user._id,
          email: req.user.email,
          firstName: req.user.firstName,
        };
        const token = jwt.sign({ user: body }, CONFIG.SECRET_KEY, {
          expiresIn: "12h",
        });

        return res.status(200).json({
          status: "success",
          message: "Signup successful",
          firstName: user.firstName,
          email: user.email,
          token,
        });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

module.exports = authRouter;
