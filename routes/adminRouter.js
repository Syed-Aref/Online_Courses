const express = require("express");
const adminRouter = express.Router();

const {sessionCheckerMW, privateMW} = require("../middlewares_new/commonMW");
const {adminLoginMW, isAdminLoggedinMW, adminSendUpdateMW, adminLogoutMW} = require("../middlewares_new/adminMW");

const {
    getAdmin,
    getAdminLogin, postAdminLogin, 
    getLoggedinAdmin, 
    getAdminSendUpdate, postAdminSendUpdate, 
    getAdminProblems, getAdminLogout
} = require("../controller/adminCtrl");

adminRouter.get('', sessionCheckerMW, getAdmin);

adminRouter.get('/login', sessionCheckerMW, getAdminLogin);
adminRouter.post('/login', sessionCheckerMW, adminLoginMW, postAdminLogin);

adminRouter.get('/:adminName', isAdminLoggedinMW, getLoggedinAdmin);

adminRouter.get('/:adminName/sendUpdate', isAdminLoggedinMW, getAdminSendUpdate);
adminRouter.post('/:adminName/sendUpdate', isAdminLoggedinMW, adminSendUpdateMW, postAdminSendUpdate);

adminRouter.get('/:adminName/problems', isAdminLoggedinMW, getAdminProblems);
 
adminRouter.get('/:adminName/logout', adminLogoutMW, getAdminLogout);

module.exports = adminRouter;