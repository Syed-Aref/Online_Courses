const sessionCheckerMW = (req, res, next) => {
    if (req.session.adminInfo) return res.redirect(`/admin/${req.session.adminInfo.user}`);

    if (req.session.loginUser) return res.redirect('/profile');

    if (req.session.registration_otp_id) return res.redirect('/register/otpVerify');

    if (req.session.twostep_otp_id) return res.redirect('/login/otpVerify');
    
    
    if(req.session.reset_otp_id) {
        if(!req.session.reset_otp) return res.redirect("/resetPassword/otpVerify");
        else return res.redirect("/resetPassword/newPassword");
    }
    
    next();
};

const privateMW = (req, res, next) => {
    if (!req.session.loginUser) {
        return res.render("notAllowed");
    }
    next();
};

module.exports = {sessionCheckerMW, privateMW};