const bcrypt = require('bcryptjs');
const otpGenerator = require('otp-generator');

const sendEmail = require("../utils/sendEmail");
const User = require("../models/User");
const OTP = require("../models/OTP");

const registerMW = async (req, res, next) => {
    let { email, username, password, fullname, role, country } = req.body;

    // Encryption
    var salt = await bcrypt.genSalt(10);
    if(!salt) return res.json("(SystemFailure_registerMW_registerMW.js) Failed to create salt");
    let hashedPassword = await bcrypt.hash(password, salt);
    if(!hashedPassword) return res.json("(SystemFailure_registerMW_registerMW.js) Failed to create hashed password");

    const user = await User.create({
        email,
        username,
        password: hashedPassword,
        fullname,
        role, 
        country
    });
    if(!user) return res.json("(SystemFailure_registerMW_resgisterMW.js) Failed to create user");

    const code = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });

    const otp = await OTP.create({
        email,
        code
    });
    if(!otp) return res.json("(SystemFailure_registerMW_resgisterMW.js) Failed to crate OTP");

    req.session.registration_otp_id = otp._id;

    const message = `Registration OTP: ${code}`;
    
    try{
        await sendEmail(email, message);
    }
    catch(e){
        console.log(`(SystemMessage_regesterMW_regestetMW.js)`);
        console.log(`e: ${e}`);
        return res.json("(SystemFailure_registerMW_resgisterMW.js) Failed to send email");
    }
    

    next();
};

const registerOTPVerifyMW = async (req, res, next) => {
    if (!req.session.registration_otp_id) return res.json("(SessioNotFound_registerOTPVerifyMW_resgisterMW.js) No registration_otp_id in the session");
    console.log(`(SystemMessage_regesterOTPVerifyMW_regestetMW.js)`);
    console.log(`req.session.registration_otp_id: ${req.session.registration_otp_id}`);

    const otpFound = await OTP.findById(req.session.registration_otp_id);
    if (!otpFound) {
        const registration_otp_id = req.session.registration_otp_id;
        delete req.session.registration_otp_id;
        return res.json(`(DataNotFoundInDatabase_registerOTPVerifyMW_resgisterMW.js) [MajorError]* OTP not found with the given id (id: ${registration_otp_id})`);
    }

    let { code } = req.body;
    console.log(`(SystemMessage_regesterOTPVerifyMW_regestetMW.js)`);
    console.log(`code: ${code}`);

    if (code == otpFound.code) {
        const userFound = await User.findOne({ email: otpFound.email });
        if(!userFound) return res.json("(SystemFailure_registerOTPVerifyMW_resgisterMW.js) No user found with the given email");

        if (!userFound) return res.json(`(DataNotFoundInDatabase_registerOTPVerifyMW_resgisterMW.js) [MajorError]* (Code matched but) No user found with the given email (email: ${otpFound.email})`);

        if (userFound.registered !== "no") return res.json("(UnexpectedError_registerOTPVerifyMW_resgisterMW.js) Registration flag is alreay positive");

        try{
            await OTP.findByIdAndDelete(req.session.registration_otp_id);
        }
        catch(e){
            console.log(`(SystemMessage_regesterOTPVerifyMW_regestetMW.js)`);
            console.log(`e: ${e}`);
            return res.json("(SystemFailure_registerOTPVerifyMW_resgisterMW.js) Failed to delete OTP");
        }
        

        delete req.session.registration_otp_id;

        userFound.registered = "yes";
        userFound.twostep = "yes";

        try{
            await userFound.save();
        }
        catch(e){
            console.log(`(SystemMessage_regesterOTPVerifyMW_regestetMW.js)`);
            console.log(`e: ${e}`);
            return res.json("(SystemFailure_registerOTPVerifyMW_resgisterMW.js) Failed to update User");
        }

        req.session.loginUser = userFound;

        return next();
    }
    else return res.json("(WrongInput_registerOTPVerifyMW_resgisterMW.js) OTP did not match");
};

module.exports = {registerMW, registerOTPVerifyMW};