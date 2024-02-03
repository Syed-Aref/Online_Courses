const express = require("express");
const registerRouter = express.Router();

const {sessionCheckerMW, privateMW} = require("../middlewares_new/commonMW");
const {registerMW, registerOTPVerifyMW} = require("../middlewares_new/registerMW");

const {getRegister, postRegister, getRegisterOTPVerify, postRegisterOTPVerify} = require("../controller/registerCtrl");

// (GET) - Registration Form
registerRouter.get("", sessionCheckerMW, getRegister);

// (POST) - Registration Form Data Inserting
registerRouter.post("", registerMW, postRegister);

// (GET) - OTP Registration Form
registerRouter.get("/otpVerify", getRegisterOTPVerify);

// (POST) - OTP Registration Form Validation
registerRouter.post("/otpVerify", registerOTPVerifyMW, postRegisterOTPVerify);

module.exports = registerRouter;