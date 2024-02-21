const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const { boolean } = require("joi");

const CreatorSchema = new mongoose.Schema({
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
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
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
  password: {
    type: String,
    required: function () {
      return this.isNew || this.isModified("password");
    },    
    minlength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    // required: [true, "Please confirm your password"],
    required: function () {
      return this.isNew || this.isModified("password");
    },
    validate: {
      validator: function (el) {
        return el === this.password ;
      },
      message: "Passwords are not the same!",
    },
    select: false,
  },
  creatorImageUrl: {
    type: String,
    default: "http://res.cloudinary.com/dzodph4o8/image/upload/v1693051381/creator-images/qa3cdrcltw6rtgejgst2.webp"
  },
  creatorImagePublicId: {
    type: String,
    default: "creator-images/qa3cdrcltw6rtgejgst2"
  },
  gender: {
    type: String,
    enum: ["Male", "Female"],
  },
  status: {
    type: String,
    enum: ["active", "non-active", "deactivated"],
    default: "active",
  },
  companyName: {
    type: String,
    unique: true,
    required: [true, "Please enter your company name"],
    trim: true,
  },
  address: String,
  agreed_to_terms: {
    type: Boolean,
    default: false, // Set default value to false
    // required: [true, "Please agree to terms"]
  }, 
  role: {
    type: String,
    default: "creator",
  },
},
{ timestamps: true });

CreatorSchema.pre("save", async function (next) {
  const user = this;
  const hash = await bcrypt.hash(this.password, 12);

  this.password = hash;

  this.confirmPassword = undefined;
  next();
});

CreatorSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);

  return compare;
};

const Creator = mongoose.model("Creator", CreatorSchema);

module.exports = Creator;
