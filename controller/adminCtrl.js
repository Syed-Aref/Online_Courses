const Problem = require("../models/Problem");

const getAdmin = (req, res) => {
    return res.redirect('/admin/login');
};

const getAdminLogin = (req, res) => {
    return res.render('admin-login');
};

const postAdminLogin = (req, res) => {
    return res.redirect(`/admin/${req.session.adminInfo.username}`);
};

const getLoggedinAdmin = (req, res) => {
    const admin = req.session.adminInfo;
    return res.render('admin', { admin });
};

const getAdminSendUpdate = (req, res)=>{
    const admin = req.session.adminInfo;
    return res.render('admin-sendUpdate', {admin});
};

const postAdminSendUpdate = (req, res)=>{
    return res.redirect(`/admin/${req.session.adminInfo.username}`);
};

const getAdminProblems = async (req, res)=>{
    try{
        const problems = await Problem.find();
        console.log("(SystemMessage_getAdminProblems_adminCtrl.js)");
        console.log(`problems: ${problems}`);
        return res.render('admin-problems', {problems});
    } catch(e){
        return res.json("(DataNotFoundInDatabase_getAdminProblems_adminCtrl.js) No problems in the database");
    }
    
};

const getAdminLogout = (req, res)=>{
    return res.redirect('/admin/login');
};

module.exports = {
    getAdmin,
    getAdminLogin, postAdminLogin, 
    getLoggedinAdmin, 
    getAdminSendUpdate, postAdminSendUpdate, 
    getAdminProblems, getAdminLogout
};