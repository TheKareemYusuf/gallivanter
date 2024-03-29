const Joi = require("joi");
const AppError = require('./../utils/appError');

const UserSchema = Joi.object({
  firstName: Joi.string().min(2).max(50),
  lastName: Joi.string().min(2).max(50),
  email: Joi.string().email(),
  // password: Joi.string().required(),
  // confirmPassword: Joi.string().required(),
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
  status: Joi.string().valid("active", "non-active", "deactivated").optional(),
  phoneNumber: Joi.string().regex(/^\d{11}$/).optional(),
  gender: Joi.string().valid("male", "female").optional(),
  levelOfStudy: Joi.string(),
  department: Joi.string().valid("arts", "sciences", "commercials").optional(),
  subjectOfInterest: Joi.array().items(Joi.string()),
  agreed_to_terms: Joi.bool(),



  // bankDetails: {
  //   bankName: Joi.string().min(2).max(50).optional(),
  //   accountNumber: Joi.string().min(2).max(50).optional(),
  //   accountName: Joi.string().min(2).max(50).optional(),
  // },

});
 
// async function UserValidationMW(req, res, next) {
//   const userPayLoad = req.body;

//   try {
//     // await UserSchema.validateAsync(userPayLoad);
//     // next();
//     const isNew = req.method === 'POST';
//     await UserSchema.validateAsync(userPayLoad, { context: { isNew } });
//     next()
//   } catch (error) {
//     next(error.details[0].message);
//   }
// }

async function UserValidationMW(req, res, next) {
  const userPayLoad = req.body;

  try {
    const isNew = req.method === 'POST';
    await UserSchema.validateAsync(userPayLoad, { context: { isNew } });
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


module.exports = UserValidationMW;
