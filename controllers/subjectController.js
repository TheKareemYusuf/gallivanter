const Subject = require("./../models/subjectModel");

const createSubject = async (req, res, next) => {
  try {
    const { subject } = req.body;
    const newSubject = await Subject.create({
      subject,
    });

    res.status(201).json({
      status: "success",
      message: "Subject created successfully",
      data: newSubject,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSubject,
};
