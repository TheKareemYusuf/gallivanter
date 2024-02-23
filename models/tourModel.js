// const { string } = require("joi");
const mongoose = require("mongoose");

const ItinerarySchema = new mongoose.Schema({
  day: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  }
});

const ImageSchema = new mongoose.Schema({
  url: String,
  publicId: String
});

const TourSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is compulsory"],
      unique: [true, "There's a tour with this name already"],
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      // get the creator from creatorSchema
      ref: "Creator",
    },
    creatorName: {
      type: String,
      // get the creator from creatorSchema
      ref: "Creator",
    },
    companyName: {
      type: String,
      // get the creator from creatorSchema
      ref: "Creator",
    },
    location: {
      type: String,
      required: true,
    },
    numOfDays: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    maxCapacity: {
      type: Number,
      required: true,
    },
    regMembers: {
      type: [
        { 
          type: mongoose.Schema.Types.ObjectId,
        },
      ],
      validate: {
        validator: function(arr) {
          return arr.length <= this.maxCapacity; // accessing maxCapacity from the schema
        },
        message: "Number of registered members cannot exceed the maximum capacity"
      },
      default: [],
    },
    numOfRegMembers: {
      type: Number,
      default: 0,
    },
    tags: [String],
    itinerary: [ItinerarySchema],
    tourCoverImageUrl: String,
    tourCoverImagePublicId: String,
    tourImagesData: [ImageSchema],
    state: {
      type: String,
      default: "published",
      enum: ["draft", "published"],
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);



const Tour = mongoose.model("Tour", TourSchema);

module.exports = Tour;
