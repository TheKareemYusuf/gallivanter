// const { string } = require("joi");
const mongoose = require("mongoose");

const TourSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Question is compulsory"],
      unique: true,
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
    tags: [String],
    tourImagesUrl: {
      type: [
        {
          type: String,
          required: true,
        },
      ],
      default: [],
    },
    state: {
      type: String,
      default: "draft",
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
