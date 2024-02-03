const express = require("express");
const loginRouter = express.Router();

const {sessionCheckerMW, privateMW} = require("../middlewares_new/commonMW");
const {loginMW, loginOTPVerifyMW} = require("../middlewares_new/loginMW");

const {getLogin, postLogin, getLoginOTPVerify, postLoginOTPVerify} = require("../controller/loginCtrl");

// (GET) - Registration Form
loginRouter.get("", sessionCheckerMW, getLogin);

// (POST) - Registration Form Data Inserting
loginRouter.post("", loginMW, postLogin);

// (GET) - OTP Registration Form
loginRouter.get("/otpVerify", getLoginOTPVerify);

// (POST) - OTP Registration Form Validation
loginRouter.post("/otpVerify", loginOTPVerifyMW, postLoginOTPVerify);

module.exports = loginRouter;