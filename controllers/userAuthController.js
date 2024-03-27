const sendEmail = require('./../utils/email');
const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const crypto = require('crypto');



const forgotPassword = async (req, res, next) => {
    try {
        {
            // 1) Get user based on POSTed email
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
              return next(new AppError('Invalid email address.', 404));
            } 
          
            // 2) Generate the random reset token
            const resetToken = user.createPasswordResetToken();
            await user.save({ validateBeforeSave: false });
          
            // 3) Send it to user's email
            const resetURL = `${req.protocol}://${req.get(
              'host'
            )}${CONFIG.RESET_URL}/${resetToken}`;
          
          

            try {

            await new sendEmail(user, resetURL).sendPasswordReset();

          
              res.status(200).json({
                status: 'success',
                message: 'Token sent to email!'
              });
            } catch (err) {
              user.passwordResetToken = undefined;
              user.passwordResetExpires = undefined;
              await user.save({ validateBeforeSave: false });
          
              return next(
                new AppError('There was an error sending the email. Try again later!'),
                500
              );
            }
          }
    } catch (error) {
        next(error)
    }
}

const resetPassword = async (req, res, next) => {
    try {
            // 1) Get user based on the token
            const hashedToken = crypto
              .createHash('sha256')
              .update(req.params.token)
              .digest('hex');
          
            const user = await User.findOne({
              passwordResetToken: hashedToken,
              passwordResetExpires: { $gt: Date.now() }
            });
          
            // 2) If token has not expired, and there is user, set the new password
            if (!user) {
              return next(new AppError('Token is invalid or has expired', 400));
            }
            user.password = req.body.password;
            user.passwordConfirm = req.body.passwordConfirm;
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save();
          
            // 3) Update changedPasswordAt property for the user
            // 4) Log the user in, send JWT
            // createSendToken(user, 200, res);
            res.status(200).json({
                status: 'success',
                message: 'Password changed successfully'
              });

    } catch (error) {
        next(error)
    }
}


module.exports = {
    forgotPassword,
    resetPassword
}