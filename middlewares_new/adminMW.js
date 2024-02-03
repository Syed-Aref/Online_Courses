const User = require("../models/User");
const Admin = require('../models/Admin');

const sendEmail = require("../utils/sendEmail");

const adminLoginMW = async (req, res, next) => {
    
    const {username, password} = req.body;
    console.log("(SystemMessage_adminLoginMW_adminMW.js)");
    console.log(`username: ${username}`);
    console.log(`password: ${password}`);

    const admin = await Admin.findOne({username});
    if(!admin) return res.json("(DataNotFoundInDatabase_adminLoginMW_adminMW.js) Admin not found with the given username");

    console.log("(SystemMessage_adminLoginMW_adminMW.js)");
    console.log(`admin: ${admin}`);

    if(admin.password !== password) return res.json("(UserMessage_adminLoginMW_adminMW.js) Password did not match");

    req.session.adminInfo = admin;
    next();
};

const isAdminLoggedinMW = async (req, res, next) => {
    if(req.session.adminInfo) return next();
    else return res.json("(SessioNotFound_isAdminLoggedinMW_adminMW.js) No adminInfo in the session");
};

const adminSendUpdateMW = async (req, res, next) => { 
    const users = await User.find({});
    if(!users) return res.json("(DataNotFoundInDatabase_adminSendUpdateMW_adminMW.js) No users found in the database");
    console.log("(SystemMessage_adminSendUpdateMW_adminMW.js)");
    console.log(`users: ${users}`);

    const {message} = req.body;
    console.log("(SystemMessage_adminSendUpdateMW_adminMW.js)");
    console.log(`message: ${message}`);

    let recipients = [];
    console.log(`(SystemMessage_adminSendUpdateMW_adminMW.js)`);
    for (var user of users){
        console.log(`user.email: ${user.email}`);
        recipients.push(user.email);
    }
    console.log("(SystemMessage_adminSendUpdateMW_adminMW.js)");
    console.log(`recipients: ${recipients}`);

    try{
        await sendEmail(recipients, message);
    }
    catch(e){
        console.log("(SystemMessage_adminSendUpdateMW_adminMW.js)");
        console.log(`e: ${e}`);
        res.json("(SystemFailure_adminSendUpdateMW_adminMW.js) Failed to send email");
    }

    next();
}

const adminLogoutMW = async (req, res, next) => {
    // Destroy the session
    req.session.destroy();

    next();
};

module.exports = {adminLoginMW, isAdminLoggedinMW, adminSendUpdateMW, adminLogoutMW};