const passport = require("passport");
const passportCustom = require("passport-custom");
const CONFIG = require("./../config/config");
const AppError = require('./../utils/appError');

const User = require("./../models/userModel");

const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

passport.use(
  new JWTstrategy(
    {
      secretOrKey: CONFIG.SECRET_KEY,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (token, next) => {
      try {
        return next(null, token.user);
      } catch (error) {
        next(error);
      }
    }
  )
);

passport.use(
  "user-signup",
  new passportCustom(async (req, next) => {
    try {
      const { firstName, lastName, email, password, confirmPassword } = req.body;

      // Check if a user with the provided username exists
      // const existingEmail = await User.findOne({ email });
      // if (existingEmail) {
      //   return next(null, false, { message: "Email is already registered" });
      // }

      const user = await User.create({
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      });

      console.log("I am done creating the user");
      return next(null, user);
    } catch (error) {
      next(error);
    }
  })
);

passport.use(
  "user-login",
  new passportCustom(async (req, next) => {
    try {
      const { email, password } = req.body;
      // const user = await User.findOne({ phoneNumber });
      const user = await User.findOne({email}).select("+password");

      if (!user) {
        return next(null, false, { message: "User not found" });
      }

      const validate = await user.isValidPassword(password);

      if (!validate) {
        return next(null, false, { message: "Wrong Password" });
      }

      return next(null, user, { message: "Logged in Successfully" });
    } catch (error) {
      return next(error);
    }
  })
);
