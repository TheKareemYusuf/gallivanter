const Joi = require("joi");

const TourSchema = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
  currency: Joi.string(),
  location: Joi.string(),
  creatorId: Joi.string(),
  creatorName: Joi.string(),
  numOfDays: Joi.number(),
  price: Joi.number(),
  maxCapacity: Joi.number().required(),
  tags: Joi.array().items(Joi.string()).optional(),
  tourImagesUrl: Joi.array().items(Joi.string()).optional(),
  state: Joi.string(),
  startDate: Joi.date(),
  endDate: Joi.date(),
});
 
// async function TourValidationMW(req, res, next) {
//   const tourPayLoad = req.body;

//   try {
//     await TourSchema.validateAsync(tourPayLoad);
//     next();
//   } catch (error) {
//     next(error.details[0].message);
//   }
// }

async function TourValidationMW(req, res, next) {
  const tourPayLoad = req.body;

  try {
    // const isNew = req.method === 'POST';
    await TourSchema.validateAsync(tourPayLoad);
    next();
  } catch (error) {
    // Check if it's a Joi validation error
    if (error.isJoi) {
      // Extract the error message and send it as a response
      // return res.status(400).json({ error: `${error.details[0].path} is invalid` });
      return next(new AppError(`${error.details[0].path} is invalid`, 400))
    } else {
      // If it's not a Joi validation error, pass it to the next middleware for general error handling
      next(error);
    }
  }
}

module.exports = TourValidationMW;
