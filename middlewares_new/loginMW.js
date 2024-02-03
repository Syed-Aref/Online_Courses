const bcrypt = require('bcryptjs');
const otpGenerator = require('otp-generator');

const sendEmail = require("../utils/sendEmail");
const User = require("../models/User");
const OTP = require("../models/OTP");

const loginMW = async (req, res, next) => {

    let { email, password } = req.body;
    console.log(`(SystemMessage_loginMW_loginMW.js)`);
    console.log(`email: ${email}`);
    console.log(`password: ${password}`);

    const userFound = await User.findOne({ email });
    if (!userFound) {
        return res.json({
            message: "(WrongInput_loginMW_loginMW.js) User not found with the given email"
        });
    }

    if (userFound.registered === "no") return res.json("(UserMessage_loginMW_loginMW.js) Please verify first");

    // Encrypted checking
    const hashedPassword = userFound.password;
    const passwordFound = await bcrypt.compare(password, hashedPassword);
    if (!passwordFound) {
        console.log(`(SystemMessage_loginMW_loginMW.js)`);
        console.log(`password: ${password}`);
        console.log(`hashedPassword: ${hashedPassword}`);
        return res.json({
            message: "(WrongInput_loginMW_loginMW.js) Password did not match"
        });
    }

    if (userFound.twostep === "no") {
        const code = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });


        const otp = await OTP.create({
            email,
            code
        });
        if(!otp) return res.json("(SystemFailure_loginMW_loginMW.js) Failed to create OTP");

        try{
            const message = `Twostep OTP: ${code}`;
            await sendEmail(email, message);
        }
        catch(e){
            console.log(`(SystemMessage_loginMW_loginMW.js)`);
            console.log(`e: ${e}`);
            return res.json("(SystemMessage_loginMW_loginMW.js) Failed to send email");
        }
        
        req.session.twostep_otp_id = otp._id;

        return next();
    }
    else {
        return res.json({
            message: "(UnexpectedError_loginMW_loginMW.js) Two-step flag is alreay positive"
        });
    }

};

const loginOTPVerifyMW = async (req, res, next) => {
    if (!req.session.twostep_otp_id) return res.json("(SessioNotFound_loginOTPVerifyMW_loginMW.js) No twostep_otp_id in the session");
    console.log(`(SystemMessage_loginOTPVerifyMW_loginMW.js)`);
    console.log(`req.session.twostep_otp_id: ${req.session.twostep_otp_id}`);
    
    const otpFound = await OTP.findById(req.session.twostep_otp_id);
    if (!otpFound) {
        const twostep_otp_id = req.session.twostep_otp_id;
        delete req.session.twostep_otp_id;
        return res.json(`(DataNotFoundInDatabase_loginOTPVerifyMW_loginMW.js) [MajorError]* OTP not found with the given id (id: ${twostep_otp_id})`);
    }

    let { code } = req.body;
    console.log(`(SystemMessage_loginOTPVerifyMW_loginMW.js)`);
    console.log(`code: ${code}`);

    if (code == otpFound.code) {
        const userFound = await User.findOne({ email: otpFound.email });
        if (!userFound) return res.json(`(DataNotFoundInDatabase_loginOTPVerifyMW_loginMW.js) [MajorError]* (Code matched but) User not found with the given email (email: ${otpFound.email})`);

        if (userFound.twostep !== "no") return res.json("(UnexpectedError_loginOTPVerifyMW_loginMW.js) Two-step flag is alreay positive");

        try{
            await OTP.findByIdAndDelete(req.session.twostep_otp_id);
        }
        catch(e){
            console.log(`(SystemMessage_loginOTPVerifyMW_loginMW.js)`);
            console.log(`e: ${e}`);
            return res.json("(SystemFailure_loginOTPVerifyMW_loginMW.js) Failed to delete OTP");
        }
        

        delete req.session.twostep_otp_id;

        try{
            userFound.twostep = "yes";
            await userFound.save();
        }
        catch(e){
            console.log(`(SystemMessage_loginOTPVerifyMW_loginMW.js)`);
            console.log(`e: ${e}`);
            return res.json("(SystemFailure_loginOTPVerifyMW_loginMW.js) Failed to save user");
        }
        

        req.session.loginUser = userFound;

        next();
    }
    else return res.json("(WrongInput_loginOTPVerifyMW_loginMW.js) Otp did not match");
};

module.exports = {loginMW, loginOTPVerifyMW};