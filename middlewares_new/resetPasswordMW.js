const bcrypt = require('bcryptjs');
const otpGenerator = require('otp-generator');

const sendEmail = require("../utils/sendEmail");
const User = require("../models/User");
const OTP = require("../models/OTP");

const resetPasswordMW = async (req, res, next)=>{
    const {email} = req.body;
    const userFound = await User.findOne({ email });
    if(!userFound) return res.json("(DataNotFoundInDatabase_resetPasswordMW_resetPasswordMW.js) User not found with the given email");

    const code = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });

    const otp = await OTP.create({
        email,
        code
    });
    if(!otp) return res.json("(SystemFailure_resetPasswordMW_resetPasswordMW.js) Failed to crate OTP");

    req.session.reset_otp_id = otp._id;

    const message = `Reset OTP: ${code}`;
    try{
        await sendEmail(email, message);
    }
    catch(e){
        console.log(`(SystemMessage_resetPasswordMW_resetPasswordMW.js)`);
        console.log(`e: ${e}`);
        return res.json("(SystemFailure_resetPasswordMW_resetPasswordMW.js) Failed to send email");
    }

    next();
};

const resetPasswordOTPVerifyMW = async (req, res, next) => {
    if (!req.session.reset_otp_id) return res.json("(SessioNotFound_resetPasswordOTPVerifyMW_resetPasswordMW.js) No reset_otp_id in the session");
    console.log(`(SystemMessage_resetPasswordMW_resetPasswordMW.js)`);
    console.log(`req.session.reset_otp_id: ${req.session.reset_otp_id}`);
    
    const otpFound = await OTP.findById(req.session.reset_otp_id);
    if (!otpFound) {
        const reset_otp_id = req.session.reset_otp_id;
        delete req.session.reset_otp_id;
        return res.json(`(DataNotFoundInDatabase_resetPasswordOTPVerifyMW_resetPasswordMW.js) [MajorError]* OTP not found with the given id (id: ${reset_otp_id})`);
    }

    let { code } = req.body;
    console.log(`(SystemMessage_resetPasswordMW_resetPasswordMW.js)`);
    console.log(`code: ${code}`);

    if (code == otpFound.code) {
        const userFound = await User.findOne({ email: otpFound.email });

        if (!userFound) {
            try{
                await OTP.findByIdAndDelete(req.session.registration_otp_id);
            }
            catch(e){
                console.log(`(SystemMessage_resetPasswordOTPVerifyMW_resetPasswordMW.js)`);
                console.log(`e: ${e}`);
                delete req.session.reset_otp_id;
                return res.json(`
                    (DataNotFoundInDatabase_resetPasswordOTPVerifyMW_resetPasswordMW.js) [MajorError]* (Code matched but) User not foune with the given email (email: ${otpFound.email})\n
                    (SystemFailure_resetPasswordOTPVerifyMW_resetPasswordMW.js) Failed to delete from OTP`
                );
            }
            delete req.session.reset_otp_id;
            return res.json(`(DataNotFoundInDatabase_resetPasswordOTPVerifyMW_resetPasswordMW.js) [MajorError]* (Code matched but) User not foune with the given email (email: ${otpFound.email})`);
        }
        req.session.reset_otp = "yes";
        next();
    }
    else return res.json("(WrongInput_resetPasswordOTPVerifyMW_resetPasswordMW.js) OTP did not match");
};

const resetPasswordNewPasswordMW = async (req, res, next) => {
    const { password } = req.body;

    if(!req.session.reset_otp_id) return res.json("(SessioNotFound_resetPasswordNewPasswordMW_resetPasswordMW.js) No reset_otp_id in the session");
    if(!req.session.reset_otp) return res.json("(SessioNotFound_resetPasswordNewPasswordMW_resetPasswordMW.js) No reset_otp in the session");

    const otpFound = await OTP.findById(req.session.reset_otp_id);
    if(!otpFound) return ("(DataNotFoundInDatabase_resetPasswordNewPasswordMW_resetPasswordMW.js) OTP not found with the given id");
    const userFound = await User.findOne({ email: otpFound.email });
    if(!userFound) return ("(DataNotFoundInDatabase_resetPasswordNewPasswordMW_resetPasswordMW.js) User not found with the given email");

    try{
        await OTP.findByIdAndDelete(req.session.reset_otp_id);
    }
    catch(e){
        console.log(`(SystemMessage_resetPasswordNewPasswordMW_resetPasswordMW.js)`);
        console.log(`e: ${e}`);
        return res.json("(SystemFailure_resetPasswordNewPasswordMW_resetPasswordMW.js) Failed to delete OTP");
    }
    delete req.session.reset_otp_id;
    delete req.session.reset_otp;

    // Encryption
    var salt = await bcrypt.genSalt(10);
    if(!salt) return res.json("(SystemFailure_resetPasswordNewPasswordMW_resetPasswordMW.js) Failed to create salt");
    let hashedPassword = await bcrypt.hash(password, salt);
    if(!hashedPassword) return res.json("(SystemFailure_resetPasswordNewPasswordMW_resetPasswordMW.js) Failed to hashed password");

    userFound.password = hashedPassword;
    userFound.twostep = "yes";
    try{
        await userFound.save();
    }
    catch(e){
        console.log(`(SystemMessage_resetPasswordNewPasswordMW_resetPasswordMW.js)`);
        console.log(`e: ${e}`);
        return res.json("(SystemFailure_resetPasswordNewPasswordMW_resetPasswordMW.js) Failed to update user");
    }
    
    req.session.loginUser = userFound;

    next();
};

module.exports = {resetPasswordMW, resetPasswordOTPVerifyMW, resetPasswordNewPasswordMW};