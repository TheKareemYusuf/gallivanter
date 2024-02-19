const Tour = require("../models/tourModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");
const Creator = require("../models/creatorModel");
const uploadPicture = require("../utils/multerImageHandler");
const sendEmail = require("../utils/email");

// const multer = require("multer");
// const sharp = require("sharp");

//-----------------------------------------------------

const {
  uploadToCloudinary,
  removeFromCloudinary,
} = require("./../utils/cloudinary");

const uploadTourPicture = uploadPicture.single("tourCoverImage");
const uploadMultiplePictures = uploadPicture.array("tourImages");

const createTour = async (req, res, next) => {
  try {
    const id = req.user._id;
    const user = await Creator.findById(id);
    if (!user) {
      return next(new AppError("Creator not found", 404));
    }

    const {
      title,
      description,
      location,
      numOfDays,
      price,
      maxCapacity,
      tags,
      startDate,
      endDate,
    } = req.body;

    let imageData = {};

    if (req.file) {
      const imageBuffer = req.file.buffer;
      const data = await uploadToCloudinary(imageBuffer, "tour-images");
      imageData = data;
    }

    const newTour = await Tour.create({
      title,
      description,
      location,
      numOfDays,
      price,
      maxCapacity,
      tags,
      startDate,
      endDate,
      tourCoverImageUrl: imageData.url,
      tourCoverImagePublicId: imageData.public_id,
      creatorName: req.user.firstName, // Change to business name
      creatorId: req.user._id,
    });

    res.status(201).json({
      status: "success",
      message: "Tour created successfully",
      data: newTour,
    });
  } catch (error) {
    next(error);
  }
};

// Get all tours
const getAllPublicTours = async (req, res, next) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

    res.status(200).json({
      status: "success",
      result: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    next(error);
  }
};

const addImages = async (req, res, next) => {
  try {
    const id = req.user._id;
    const user = await Creator.findById(id);
    if (!user) {
      return next(new AppError("Creator not found", 404));
    }

    const tourId = req.params.tourId;

    const tour = await Tour.findById(tourId);

    if (!tour) {
      return next(new AppError("Tour not found", 404));
    }

    let imageData = [];

    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const imageBuffer = req.files[i].buffer;
        const data = await uploadToCloudinary(imageBuffer, "tour-images");
        // Save the URL of the uploaded image to the tour model
        tour.tourImagesUrl.push(data.url);
        // Optionally, save the public ID of the uploaded image to the tour model
        // tour.tourImagesPublicIds.push(data.public_id);
        imageData.push(data);
      }
    }

    // Save the updated tour model
    await tour.save();

    return res.status(200).json({
      status: "success",
      message: "Images uploaded successfully",
      images: imageData,
      tour,
    });
  } catch (error) {
    next(error);
  }
};

// Get single tour
const getAPublicTour = async (req, res, next) => {
  try {
    const id = req.params.tourId;
    const tour = await Tour.findById(id);

    if (!tour) {
      return next(new AppError("Tour not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getCreatourTours = async (req, res, next) => {
  try {
    // grab the id of the person hitting the route from req.body
    const id = req.user._id;
    // use the id to query the database to get role
    const user = await Creator.findById(id);
    if (!user) {
      return next(new AppError("Creator not found", 404));
    } else {
      const features = new APIFeatures(
        Tour.find().where("creatorId").equals(id),
        req.query
      )
        .filter()
        .sort()
        .limitFields()
        .paginate();
      const tours = await features.query;

      res.status(200).json({
        status: "success",
        result: tours.length,
        data: {
          tours,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

const getACreatorTour = async (req, res, next) => {
  try {
    const id = req.params.tourId;
    const tour = await Tour.findById(id);
    // grab the id of the person hitting the route from req.body
    const creatorId = req.user._id;
    // use the id to query the database to get role
    const user = await Creator.findById(creatorId);

    if (!user) {
      return next(new AppError("Creator not found", 404));
    }

    if (!tour) {
      return next(new AppError("Tour not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getTourRegMembers = async (req, res, next) => {
  try {
    // Get the creator id
    const creatorId = req.user._id;

    // Get tour id
    const tourId = req.params.tourId;

    // Find the creator by Id
    const creator = await Creator.findById(creatorId);

    if (!creator) {
      return next(new AppError("Creator not found", 404));
    }

    // Find the tour by Id
    const tour = await Tour.findById(tourId);

    if (!tour) {
      return next(new AppError("Tour not found", 404));
    }

    // Check if the creator is the creator of the tour
    if (tour.creatorId.toString() !== creatorId.toString()) {
      return next(
        new AppError("You are not authorized to access this tour", 403)
      );
    }

    // Get the user IDs who registered for the tour
    const regUserIds = tour.regMembers;

    // Fetch user details using the user IDs
    const regUsers = await User.find({ _id: { $in: regUserIds } });

    return res.status(200).json({
      status: "success",
      message: "Registered users for the tour retrieved successfully",
      regUsers,
    });
  } catch (error) {
    next(error);
  }
};

const getCreatorToursRegMembers = async (req, res, next) => {
  try {
    // Get the creator id
    const creatorId = req.user._id;

    // Find all tours created by the creator
    const creatorTours = await Tour.find({ creatorId });

    if (!creatorTours || creatorTours.length === 0) {
      return next(new AppError("No tours found for the creator", 404));
    }

    // Collect all registered member IDs from all tours
    let regMemberIds = [];
    creatorTours.forEach((tour) => {
      regMemberIds = regMemberIds.concat(tour.regMembers);
    });

    // Fetch details of the registered members
    // const regMembers = await User.find({ _id: { $in: regMemberIds } });

    // Fetch details of the registered members (only select specified fields)
    const regMembers = await User.find({ _id: { $in: regMemberIds } }).select(
      "firstName lastName email phoneNumber"
    );

    return res.status(200).json({
      status: "success",
      message: "Registered members of all tours retrieved successfully",
      regMembers,
    });
  } catch (error) {
    next(error);
  }
};

const updateTour = async (req, res, next) => {
  try {
    let tourUpdate = { ...req.body };
    const id = req.params.tourId;
    const creatorId = req.user._id;
    console.log(creatorId);

    if (tourUpdate.state) delete tourUpdate.state;

    const oldTour = await Tour.findById(id);

    if (!oldTour) {
      return next(new AppError("Tour not found", 404));
    }

    if (creatorId.toString() !== oldTour.creatorId._id.toString()) {
      return next(new AppError("You are not authorized", 403));
    }

    const tour = await Tour.findByIdAndUpdate(id, tourUpdate, {
      new: true,
      runValidators: true,
      context: "query",
    });

    if (!tour) {
      return next(new AppError("Tour not found", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Tour updated successfully",
      data: tour,
    });
  } catch (error) {
    next(error);
  }
};

const updateTourState = async (req, res, next) => {
  try {
    let state = req.body.state;
    const id = req.params.tourId;

    const oldTour = await Tour.findById(id);

    // Checking if the user attempting to update is the author
    if (req.user._id.toString() !== oldTour.creatorId._id.toString()) {
      return next(new AppError("You're not authorized", 403));
    }

    if (
      !(
        state &&
        (state.toLowerCase() === "draft" || state.toLowerCase() === "published")
      )
    ) {
      return new AppError("Please provide a valid state", 400);
    }

    const tour = await Tour.findByIdAndUpdate(
      id,
      { state: state.toLowerCase() },
      { new: true, runValidators: true, context: "query" }
    );

    if (!tour) {
      return next(new AppError("Question not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: tour,
    });
  } catch (error) {
    next(error);
  }
};

const joinATour = async (req, res, next) => {
  try {
    // Get the id of the tour
    const tourId = req.params.tourId;

    // Get user id
    const userId = req.user._id;

    // Fetch the tour by its ID
    const tour = await Tour.findById(tourId);

    // Check if user is already registered for the tour
    if (tour.regMembers.includes(userId)) {
      return next(new AppError("You are already registered for this tour", 400));
    }

    if (!tour) {
      return next(new AppError("Tour not found", 404));
    }

    // Check if there is space to join the tour
    if (tour.numOfRegMembers >= tour.maxCapacity) {
      return next(new AppError("No space available to join the tour", 400));
    }

    // Add user Id to the regMembers field of the tour model
    tour.regMembers.push(userId);

    // Increment numOfRegMembers by 1
    tour.numOfRegMembers = tour.regMembers.length;

    // Save the updated tour document
    await tour.save();

    // Update the user model to include the tour
    const user = await User.findById(userId);
    const userEmail = user.email;
    const tourTitle = tour.title;

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Add the tour ID to the user's tours array
    user.tours.push(tourId);

    // Save the updated user document
    await user.save();

    // Send confirmation email
    const message = `Dear ${user.firstName},\n\nThank you for registering for the ${tourTitle} tour! We are excited to have you onboard. Your registration for the tour is confirmed.\n\nWe look forward to seeing you on the tour!\n\nWarm regards,\nYour Tour Team`;
    
    await sendEmail({
      email: userEmail,
      subject: "Tour Registration Confirmation",
      message,
    });

    return res.status(200).json({ status: "success", message: "Joined the tour successfully" });
  } catch (error) {
    next(error);
  }
};


const getRegTourDetails = async (req, res, next) => {
  try {
    // Get the user id
    const userId = req.user._id;

    // Get tour Id from query params
    const tourId = req.params.tourId;

    // Find the user by Id
    const user = await User.findById(userId);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Check if the user has the requested tour
    if (!user.tours.includes(tourId)) {
      return next(new AppError("User is not registered for this tour", 404));
    }

    // Fetch tour details using the tourId
    const tour = await Tour.findById(tourId);

    if (!tour) {
      return next(new AppError("Tour not found", 404));
    }
    return res.status(200).json({
      status: "success",
      message: "Tour details retrieved successfully",
      tour,
    });
  } catch (error) {
    next(error);
  }
};

const getAllRegTourDetails = async (req, res, next) => {
  try {
    // Get the user id
    const userId = req.user._id;

    // Find the user by Id
    const user = await User.findById(userId);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Get the tours field from the user document
    const tourIds = user.tours;

    // Fetch tour details using the tourIds
    const tours = await Tour.find({ _id: { $in: tourIds } });

    return res.status(200).json({
      status: "success",
      message: "User tours retrieved successfully",
      tours,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTour,
  addImages,
  uploadTourPicture,
  uploadMultiplePictures,
  getAllPublicTours,
  getAPublicTour,
  getCreatourTours,
  getACreatorTour,
  getTourRegMembers,
  getCreatorToursRegMembers,
  updateTour,
  updateTourState,
  joinATour,
  getRegTourDetails,
  getAllRegTourDetails,
};

//-----------------------------------------------------
// const {
//   uploadToCloudinary,
//   removeFromCloudinary,
// } = require("./../utils/cloudinary");

// const uploadQuestionPicture = uploadPicture.single("questionImage");

// // const resizeQuestionPicture = async (req, res, next) => {
// //   if (!req.file) return next();

// //   req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

// //   await sharp(req.file.buffer)
// //     .resize(500, 500)
// //     .toFormat("jpeg")
// //     .jpeg({ quality: 90 })
// //     .toFile(`public/${req.file.filename}`);

// //   next();
// // };

// const deleteTour = async (req, res, next) => {
//   try {
//     const id = req.params.id;
//     const oldTour = await Tour.findById(id);

//     if (!oldTour) {
//       return next(new AppError("Tour not found", 404));
//     }

//     // Checking if the user attempting to delete is the author
//     // if (req.user._id.toString() !== oldTour.creatorId._id.toString()) {
//     //   return next(
//     //     new AppError("You cannot delete as you're not the author", 403)
//     //   );
//     // }

//     await Tour.findByIdAndRemove(id);

//     res.status(200).json({
//       status: "tour successfully deleted",
//       data: null,
//     });
//   } catch (error) {
//     next(error);
//   }
// };
