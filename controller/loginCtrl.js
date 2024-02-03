const getLogin = (req, res) => {
    res.render("login");
};

const postLogin = (req, res) => {
    res.redirect("/login/otpVerify");
};

const getLoginOTPVerify = (req, res) => {
    res.render("login-otpVerify");
};

const postLoginOTPVerify = (req, res) => {
    res.redirect("/profile");
};

module.exports = {getLogin, postLogin, getLoginOTPVerify, postLoginOTPVerify};