// ------- Import all dependecies ------- //
const path = require('path'); 
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const session = require("express-session");
const MongoStore = require("connect-mongo");
const otpGenerator = require('otp-generator');
const multer = require("multer");
const dotenv = require('dotenv');
const bodyParser = require('body-parser');


// ------- Create instances if necessary ------- //
const app = express();

// ------- Import all utility functions ------- //
require("./utils/dbConnect");
const sendEmail = require("./utils/sendEmail");
const storage = require("./utils/cloudinary");

// ------- Import all models ------- //
const User = require("./models/User");
const OTP = require("./models/OTP");
const Course = require("./models/Course");
const Problem = require("./models/Problem");
const Admin = require('./models/Admin');
const Gallery = require("./models/Gallery");
const Lesson = require("./models/Lesson");
const Content = require("./models/Content");

// ------- Configure express ------- //
// View engine setup ejs
app.set("view engine", "ejs");

// Static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/admin/:adminName", express.static(path.join(__dirname, "public")));
app.use("/profile/:id", express.static(path.join(__dirname, "public")));
app.use("/profile/:id/course/:cid", express.static(path.join(__dirname, "public")));
app.use("/profile/:id/search/:searchTerm", express.static(path.join(__dirname, "public")));

// Configure multer
const upload = multer({ storage });

// Pass JSON data
app.use(express.json());

// Pass form data
app.use(express.urlencoded({ extended: true }));

// ???
app.use(bodyParser.urlencoded({ extended: true }));

// Configure session
app.use(session({
    secret: "123412340000",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 24 * 60 * 60 }, 
    store: new MongoStore({
      mongoUrl:
        "mongodb+srv://arefahmedprevail:3lUBBYjioxLvqdxR@mongodb-demo.z2x5gnd.mongodb.net/online-courses?retryWrites=true&w=majority",
      ttl: 24 * 60 * 60, //1 day
    })
  })
);
// Details about session: https://expressjs.com/en/resources/middleware/session.html 
// Details on connect-mongo: https://www.npmjs.com/package/connect-mongo 

// Configure dotenv
dotenv.config();

// ------- Import routes ------- //
const indexRouter = require('./routes/indexRouter');
const registerRouter = require('./routes/registerRouter');
const loginRouter = require('./routes/loginRouter');
const resetPasswordRouter = require('./routes/resetPasswordRouter');
const logoutRouter = require('./routes/logoutRouter');
const profileRouter = require('./routes/profileRouter');
const protectedRouter = require('./routes/protectedRouter');
const adminRouter = require('./routes/adminRouter');

// ------- Define routes ------- //
app.use("/", indexRouter);
app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/resetPassword", resetPasswordRouter);
app.use("/logout", logoutRouter);
app.use("/profile", profileRouter);
app.use("/protected", protectedRouter);
app.use("/admin", adminRouter);

// ------- Listen ------- //
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
// URL: http://localhost:3000 