const User = require("../models/User");

const logoutMW = async (req, res, next)=>{

    try{
        await User.findByIdAndUpdate(req.session.loginUser._id, { twostep: "no" });
    }
    catch(e){
        console.log(e);
        return res.json("(SystemFailure_logoutMW_logoutMW.js) Failed to update user");
    }
    
    // Destroy the session
    req.session.destroy();

    next();
};

module.exports = {logoutMW};