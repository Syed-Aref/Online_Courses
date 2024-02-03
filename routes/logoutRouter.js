const express = require("express");
const logoutRouter = express.Router();

const {logoutMW} = require("../middlewares_new/logoutMW");

const { getLogout } = require("../controller/logoutCtrl");


logoutRouter.get("", logoutMW, getLogout);

module.exports = logoutRouter;