const getResetPassword = (req, res) => {
    res.render("resetPassword");
};

const postResetPassword = (req, res) => {
    res.redirect("/resetPassword/otpVerify");
};

const getResetPasswordOTPVerify = (req, res) => {
    res.render("resetPassword-otpVerify");
};

const postResetPasswordOTPVerify = (req, res) => {
    res.redirect("/resetPassword/newPassword");
};

const getResetPasswordNewPassword = (req, res) => {
    res.render("resetPassword-newPassword");
};

const postResetPasswordNewPassword = (req, res) => {
    res.redirect('/profile');
};

module.exports = {getResetPassword, postResetPassword, getResetPasswordOTPVerify, postResetPasswordOTPVerify, getResetPasswordNewPassword, postResetPasswordNewPassword};