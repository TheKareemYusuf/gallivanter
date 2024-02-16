const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const validator = require("validator");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please enter first name"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Please enter last name"],
      trim: true,
    },
    // userName: {
    //   type: String,
    //   required: true,
    //   unique: true,
    // },
    email: {
      type: String,
      required: [true, "email is registered"],
      unique: true,
    },
    password: {
      type: String,
      minlength: 8,
      select: false,
      required: function () {
        return this.isNew || this.isModified("password");
      },
    },
    confirmPassword: {
      type: String,
      select: false,
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the same!",
      },
      required: function () {
        return this.isNew || this.isModified("password");
      },
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
    },
    tours: {
      type: [
        { 
          type: mongoose.Schema.Types.ObjectId,
        },
      ],
      default: []
    },
    phoneNumber: String,
    address: String,
    // Other relevant fields
    // You can add more fields as needed
    // For example: nationality, date of birth, etc.
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  const user = this;

  if (!this.isModified("password")) return next();

  const hash = await bcrypt.hash(this.password, 12);

  this.password = hash;

  this.confirmPassword = undefined;
  next();
});

UserSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);

  return compare;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
