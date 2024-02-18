const mongoose = require("mongoose");
const Creator = require("./../models/creatorModel");
const Tour = require("./../models/tourModel");
const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");
const uploadPicture = require("./../utils/multerImageHandler");
const {
  uploadToCloudinary,
  removeFromCloudinary,
} = require("./../utils/cloudinary");

const uploadCreatorPicture = uploadPicture.single("creatorProfileImage");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const getAllCreators = async (req, res, next) => {
  try {
    // const id = req.user._id;

    const features = new APIFeatures(Creator.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const creators = await features.query;

    res.status(200).json({
      status: "success",
      result: creators.length,
      data: {
        creators,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getCreator = async (req, res, next) => {
  try {
    const id = req.params.id;
    const creator = await Creator.findById(id);

    if (!creator) {
      return next(new AppError("Creator not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        creator,
      },
    });
  } catch (error) {
    next(error);
  }
};

// In progress
const uploadCreatorProfilePicture = async (req, res, next) => {
  try {
    // Get the user id
    const id = req.user._id;
    const creator = await Creator.findById(id);

    // check to see if creator truly exists
    if (!creator) {
      return next(new AppError("Creator not found", 404));
    }

    if (!req.file) {
      return next(new AppError("No file attached", 400))
    }

    // Remove the previously uploaded image from clodinary
    const public_id = creator.creatorImagePublicId;
    if (public_id && public_id !== "creator-images/qa3cdrcltw6rtgejgst2") {
      await removeFromCloudinary(public_id);
    }

    // initialize image data
    let imageData = {};

    // uploads the image to cloudinary if there's any
    if (req.file) {
      const imageBuffer = req.file.buffer;
      const data = await uploadToCloudinary(imageBuffer, "creator-images");
      imageData = data;
    }

    console.log(imageData);

    // update the database with the recently uploaded image
    const profileImage = await Creator.findByIdAndUpdate(
      id,
      {
        creatorImageUrl: imageData.url,
        creatorImagePublicId: imageData.public_id,
      },
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    );

    res.status(200).json({
      status: "success",
      message: "Profile picture uploaded successfully",
      data: {
        creatorImageUrl: imageData.url,
        creatorImagePublicId: imageData.public_id,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateCreatorProfile = async (req, res, next) => {
  try {
    let creatorUpdate = { ...req.body };
    const id = req.user._id;

    if (req.body.password || req.body.confirmPassword) {
      return next(
        new AppError(
          'This route is not for password updates. Please use /updateMyPassword.',
          400
        )
      );
    }  

    const filteredBody = filterObj(creatorUpdate, 'firstName', 'lastName', 'email', 'phoneNumber');


    const updatedCreator = await Creator.findByIdAndUpdate(id, filteredBody, {
      new: true,
      runValidators: true,
      context: "query",
    });

   

    res.status(200).json({
      status: "success",
      message: "Creator updated successfully",
      data: updatedCreator,
    });
  } catch (error) {
    next(error);
  }
};
const getProfile = async (req, res, next) => {
  try {
    const id = req.user._id;
    const creator = await Creator.findById(id);

    if (!creator) {
      return next(new AppError("Creator not found", 404));
    }

    // const creatorProfileStats = await Question.getCreatorProfileStats(id);
    // // Transform the array of statsByState into an object
    // const statsByStateObj = {};
    // creatorProfileStats[0].statsByState.forEach((stat) => {
    //   statsByStateObj[stat._id] = stat.count;
    // });

    // // Ensure that all states (pending, approved, rejected) are present in the response
    // const stateLabels = ["pending", "approved", "rejected"];
    // stateLabels.forEach((state) => {
    //   if (!statsByStateObj.hasOwnProperty(state)) {
    //     statsByStateObj[state] = 0;
    //   }
    // });

    res.status(200).json({
      status: "success",
      data: creator,
    });
  } catch (error) {
    next(error);
  }
};

// const getCreatorQuestionStats = async (req, res, next) => {
//   try {
//     const id = req.user._id;
//     const creator = await Creator.findById(id);

//     if (!creator) {
//       return next(new AppError("Creator not found", 404));
//     }

//     const subjects = creator.creatorSubjectOfInterest

//     const creatorQuestionStats = await Question.CreatorQuestionStats(id, subjects)
    
    
//     console.log(creatorQuestionStats);// Create a map of subjects to objects for quick lookup
    

//     res.status(200).json({
//       status: "success",
//       data: creatorQuestionStats
//     });
//   } catch (error) {
//     next(error);
//   }
// };


const getCreatorQuestionStats = async (req, res, next) => {
  try {
    const id = req.user._id;
    const creator = await Creator.findById(id);

    if (!creator) {
      return next(new AppError("Creator not found", 404));
    }

    const subjectsOfInterest = creator.creatorSubjectOfInterest;

      const questionStats = await Question.CreatorQuestionStats(id, subjectsOfInterest)


    // Get a list of subjects that the creator has not set any questions on
    const subjectsWithNoQuestions = subjectsOfInterest.filter(
      (subject) =>
        !questionStats.find((stat) => stat._id === subject)
    );

    // Add the subjects with zero questions to the questionStats array
    subjectsWithNoQuestions.forEach((subject) => {
      questionStats.push({
        _id: subject,
        totalQuestionsByCreator: 0,
      });
    });

    // Calculate the total questions for each subject
    const totalQuestionsBySubject = await Question.TotalCreatorQuestionStats(subjectsOfInterest)

    // Merge the total questions into the questionStats array
    questionStats.forEach((stat) => {
      const totalQuestionStat = totalQuestionsBySubject.find(
        (totalStat) => totalStat._id === stat._id
      );
      if (totalQuestionStat) {
        stat.totalQuestions = totalQuestionStat.totalQuestions;
      }
    });

    // Calculate the percentage
    questionStats.forEach((stat) => {
      if (stat.totalQuestions === 0) {
        stat.percentage = 0;
      } else {
        stat.percentage =
          (stat.totalQuestionsByCreator / stat.totalQuestions) * 100;
      }
    });

    res.status(200).json({
      status: "success",
      data: questionStats,
    });
  } catch (error) {
    next(error);
  }
};

const createCreator = (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: "creator created successfully",
  });
};

const updateCreatorStatus = async (req, res, next) => {
  try {
    let status = req.body.status;
    const id = req.params.id;

    if (req.user.role !== "admin") {
      return new AppError("You are not authorized", 403);
    }

    if (
      !(
        status &&
        (status.toLowerCase() === "active" ||
          status.toLowerCase() === "non-active" ||
          status.toLowerCase() === "deactivated")
      )
    ) {
      return next(new AppError("Please provide a valid status"));
    }

    const creator = await Creator.findByIdAndUpdate(
      id,
      { status: status.toLowerCase() },
      { new: true, runValidators: true, context: "query" }
    );

    if (!creator) {
      return next(new AppError("creator not found!", 404));
    }

    res.status(200).json({
      status: "success",
      data: creator,
    });
  } catch (error) {
    next(error);
  }
};

const addSubjectByCreator = async (req, res, next) => {
  try {
    const id = req.user._id;

    // Expecting an array of subjects in the request body
    const subjectsToAdd = req.body.creatorSubjectOfInterest;
    const creator = await Creator.findById(id);

    if (!creator) {
      return next(new AppError("creator not found!", 404));
    }

    // const currentSubjects = creator.creatorSubjectOfInterest

    if (subjectsToAdd.length > 4) {
      return next(new AppError("You can only add at most 4 subjects", 400));
    }

    // Prevent duplicates by checking if the subject is already present in the array
    uniqueSubjectsToAdd = subjectsToAdd.filter(
      (subject, i, a) => a.indexOf(subject) === i
    );

    const addedSubjects = await Creator.findByIdAndUpdate(
      id,
      { creatorSubjectOfInterest: uniqueSubjectsToAdd },
      { new: true, runValidators: true, context: "query" }
    );

    res.status(200).json({
      status: "success",
      data: addedSubjects,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCreator = async (req, res, next) => {
  try {
    const id = req.params.id;
    const oldCreator = await Creator.findById(id);

    if (!oldCreator) {
      return next(new AppError("Creator not found", 404));
    }

    await Creator.findByIdAndRemove(id);

    res.status(200).json({
      status: "creator successfully deleted",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCreators,
  getCreator,
  getProfile,
  getCreatorQuestionStats,
  updateCreatorProfile,
  uploadCreatorPicture,
  uploadCreatorProfilePicture,
  createCreator,
  updateCreatorStatus,
  addSubjectByCreator,
  deleteCreator,
};
