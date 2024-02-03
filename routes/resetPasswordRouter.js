const express = require("express");
const resetPasswordRouter = express.Router();

const {sessionCheckerMW, privateMW} = require("../middlewares_new/commonMW");
const {resetPasswordMW, resetPasswordOTPVerifyMW, resetPasswordNewPasswordMW} = require("../middlewares_new/resetPasswordMW");

const {getResetPassword, postResetPassword, getResetPasswordOTPVerify, postResetPasswordOTPVerify, getResetPasswordNewPassword, postResetPasswordNewPassword} = require("../controller/resetPasswordCtrl");

// (GET) - Reset Password Form 
// (Give Email to The Server)
resetPasswordRouter.get("", sessionCheckerMW, getResetPassword);

// (POST) - Reset Password Form 
// (Server Sends OTP to The email) 
resetPasswordRouter.post("", resetPasswordMW, postResetPassword);

// (GET) - OTP To Reset Password Verification 
resetPasswordRouter.get("/otpVerify", getResetPasswordOTPVerify);


// (POST) - OTP To Reset Password Verification 
// (Server Will Verify OTP) 
resetPasswordRouter.post("/otpVerify", resetPasswordOTPVerifyMW, postResetPasswordOTPVerify);

// (GET) - New Password 
resetPasswordRouter.get("/newPassword", getResetPasswordNewPassword);

// (POST) - New Password 
// (Server Will Change Password)
resetPasswordRouter.post("/newPassword", resetPasswordNewPasswordMW, postResetPasswordNewPassword);

module.exports = resetPasswordRouter;