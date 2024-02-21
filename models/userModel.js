const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
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
      default: [],
    },
    phoneNumber: {
      type: String,
      required: function () {
        return this.isNew || this.isModified("password");
      },
      // required: [true, "Phone number is required"],
      match: /^\d{11}$/,
      unique: true,
    },
    creatorImageUrl: {
      type: String,
      default: "http://res.cloudinary.com/dzodph4o8/image/upload/v1693051381/creator-images/qa3cdrcltw6rtgejgst2.webp"
    },
    creatorImagePublicId: {
      type: String,
      default: "creator-images/qa3cdrcltw6rtgejgst2"
    },
    address: String,
    agreed_to_terms: {
      type: Boolean,
      default: false, // Set default value to false
      // required: [true, "Please agree to terms"]
    },
    role: {
      type: String,
      default: "user",
    },
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
