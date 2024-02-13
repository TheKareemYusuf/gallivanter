const Joi = require("joi");

const TourSchema = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
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
 
async function TourValidationMW(req, res, next) {
  const tourPayLoad = req.body;

  try {
    await TourSchema.validateAsync(tourPayLoad);
    next();
  } catch (error) {
    next(error.details[0].message);
  }
}

module.exports = TourValidationMW;
