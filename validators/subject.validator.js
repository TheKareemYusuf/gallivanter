const Joi = require("joi");

const SubjectSchema = Joi.object({
  subject: Joi.string().max(225).required(),
});

async function SubjectValidationMW(req, res, next) {
    const subjectPayLoad = req.body;
  
    try {
      await SubjectSchema.validateAsync(subjectPayLoad);
      next();
    } catch (error) {
      next(error.details[0].message);
    }
  }
  
  module.exports = SubjectValidationMW;