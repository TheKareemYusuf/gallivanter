const Joi = require("joi");

const CreatorSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).when('$isNew', {
    is: true,
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  lastName: Joi.string().min(2).max(50).when('$isNew', {
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
  // creatorSubjectOfInterest: Joi.array().items(Joi.string())
 
});
 
async function CreatorValidationMW(req, res, next) {
  const creatorPayLoad = req.body;

  try {
    await CreatorSchema.validateAsync(creatorPayLoad);
    next();
  } catch (error) {
    next(error.details[0].message);
  }
}

module.exports = CreatorValidationMW;
