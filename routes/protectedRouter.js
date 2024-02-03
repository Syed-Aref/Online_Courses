const express = require("express");
const protectedRouter = express.Router();

const {sessionCheckerMW, privateMW} = require("../middlewares_new/commonMW");

const {getProtected} = require("../controller/protectedCtrl");

protectedRouter.get("", privateMW, getProtected);

module.exports = protectedRouter;