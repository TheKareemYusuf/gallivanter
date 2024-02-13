const AppError = require('./../utils/appError');
const Creator = require('./../models/creatorModel');

const restrictTo = (...roles) => {
  return async (req, res, next) => {


    
      
      // roles ['admin', 'lead-guide']. role='user'
      // grab the id of the person hitting the route from req.body
      const id = req.user._id;
      // use the id to query the database to get role
      const user = await Creator.findById(id);
  
      // console.log(req);
      if (!roles.includes(user.role)) {
        return next(
          new AppError("You do not have permission to perform this action", 403)
        );
      }
  
      next();
    

  };
};

module.exports = {
  restrictTo,
};
