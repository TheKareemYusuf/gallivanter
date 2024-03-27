const Joi = require("joi");

const CreatorSchema = Joi.object({
  firstName: Joi.string().when('$isNew', {
    is: true,
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  lastName: Joi.string().when('$isNew', {
    is: true,
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  email: Joi.string().email().when('$isNew', {
    is: true,
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  password: Joi.string().when('$isNew', {
    is: true,
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  confirmPassword: Joi.string().when('$isNew', {
    is: true,
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  address: Joi.string(),
  status: Joi.string(),
  gender: Joi.string(),
  companyName: Joi.string(),
  phoneNumber: Joi.string().regex(/^\d{11}$/).optional(),
  agreed_to_terms: Joi.bool(),
});
 
// async function CreatorValidationMW(req, res, next) {
//   const creatorPayLoad = req.body;

//   try {
//     await CreatorSchema.validateAsync(creatorPayLoad);
//     next();
//   } catch (error) {
//     next(error.details[0].message);
//   }
// }

async function CreatorValidationMW(req, res, next) {
  const creatorPayLoad = req.body;

  try {
    // const isNew = req.method === 'POST';
    await CreatorSchema.validateAsync(creatorPayLoad);
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

module.exports = CreatorValidationMW;
