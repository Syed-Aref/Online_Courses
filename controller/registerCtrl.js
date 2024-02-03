const getRegister = (req, res) => {
    res.render("register");
};

const postRegister = (req, res) => {
    res.redirect("/register/otpVerify");
};

const getRegisterOTPVerify = (req, res) => {
    res.render("register-otpVerify");
};

const postRegisterOTPVerify = (req, res) => {
    res.redirect("/profile");
};

module.exports = {getRegister, postRegister, getRegisterOTPVerify, postRegisterOTPVerify};