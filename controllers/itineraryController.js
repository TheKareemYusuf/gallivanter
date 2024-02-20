const Tour = require("./../models/tourModel");
const AppError = require("./../utils/appError");

// Create Itinerary
const createItinerary = async (req, res, next) => {
  try {
    const tourId = req.params.tourId;
    const { day, title, description, image } = req.body;

    const tour = await Tour.findById(tourId);

    if (!tour) {
      return next(new AppError("Tour not found", 404));
    }


    tour.itinerary.push({ day, title, description, image });
    await tour.save();

    res.status(201).json({
      status: "success",
      message: "Itinerary created successfully",
      data: tour.itinerary[tour.itinerary.length - 1], // Return the created itinerary
    });
  } catch (error) {
    next(error);
  }
};

// Get all itenary
const getALlItinerary = async (req, res, next) => {
  try {
    const tourId = req.params.tourId;
    const tour = await Tour.findById(tourId);

    if (!tour) {
      return next(new AppError("Tour not found", 404));
    }

    const itinerary = tour.itinerary;

    res.status(200).json({
      status: "success",
      message: "List of tour itineraries retrieved successfully",
      data: itinerary, // Return the list itinerary
    });
  } catch (error) {
    next(error);
  }
};

// Get a single Itinerary
const getOneItinerary = async (req, res, next) => {
  try {
    const tourId = req.params.tourId;
    const tour = await Tour.findById(tourId);

    if (!tour) {
      return next(new AppError("Tour not found", 404));
    }

    const itineraryId = req.params.itineraryId;
    // const data = tour.itinerary;
    const itinerary = tour.itinerary.id(itineraryId);

    res.status(200).json({
      status: "success",
      message: "itinerary retrieved succesfully",
      data: itinerary, // Return the list itinerary
    });
  } catch (error) {
    next(error);
  }
};

// Update Itinerary
const updateItinerary = async (req, res, next) => {
  try {
    const tourId = req.params.tourId;
    const itineraryId = req.params.itineraryId;
    const { day, title, description, image } = req.body;

    const tour = await Tour.findById(tourId);

    if (!tour) {
      return next(new AppError("Tour not found", 404));    
    }

    const itinerary = tour.itinerary.id(itineraryId);
    if (!itinerary) {
        return next(new AppError("Itinerary not found", 404));
    }

    // Update itinerary fields
    itinerary.day = day;
    itinerary.title = title;
    itinerary.description = description;
    itinerary.image = image;

    await tour.save();

    res.status(200).json({
      status: "success",
      message: "Itinerary updated successfully",
      data: itinerary,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Itinerary
const deleteItinerary = async (req, res, next) => {
    try {
      const tourId = req.params.tourId;
      const itineraryId = req.params.itineraryId;
  
      // Find the tour by its ID
      const tour = await Tour.findById(tourId);
  
      // Check if the tour exists
      if (!tour) {
        return next(new AppError("Tour not found", 404));
      }
  
      // Find the index of the itinerary within the tour's itinerary array
      const itineraryIndex = tour.itinerary.findIndex(
        (itinerary) => itinerary._id.toString() === itineraryId
      );
  
      // Check if the itinerary exists
      if (itineraryIndex === -1) {
        return next(new AppError("Itinerary not found", 404));
      }
  
      // Remove the itinerary from the tour's itinerary array
      tour.itinerary.splice(itineraryIndex, 1);
  
      // Save the tour with the updated itinerary array
      await tour.save();
  
      res.status(204).json({
        status: "success",
        message: "Itinerary deleted successfully",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  };
  

module.exports = {
  createItinerary,
  getALlItinerary,
  getOneItinerary,
  updateItinerary,
  deleteItinerary,
};
