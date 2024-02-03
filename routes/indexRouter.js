const express = require("express");
const indexRouter = express.Router();

const {getIndex} = require("../controller/indexCtrl");

indexRouter.get("", getIndex);

module.exports = indexRouter;