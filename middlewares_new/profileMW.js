const User = require("../models/User");
const Course = require("../models/Course");
const Problem = require("../models/Problem");
const Lesson = require("../models/Lesson");
const Content = require("../models/Content");
const stripe = require('stripe');
const dotenv = require('dotenv');

// Configure dotenv
dotenv.config();

const sendEmail = require("../utils/sendEmail");

const profileCreatorMW = async (req, res, next) => {
    const user = await User.findById(req.session.loginUser._id);
    if(!user) res.json("(DataNotFoundInDatabase_profileCreatorMW_profileMW.js) User not found with the given email");

    if (user.role !== 'creator') return res.json("(UserMessage_profileCreatorMW_profileMW.js) Service not availabe for you");
    next();
};

const profileCreateMW = async (req, res, next) => {
    const user = await User.findOne({ email: req.session.loginUser.email });
    if(!user) res.json("(DataNotFoundInDatabase_profileCreateMW_profileMW.js) User not found with the given id");

    const { cid, title, charge } = req.body;
    console.log("(SystemMessage_profileCreateMW_profileMW.js)");
    console.log({ cid, title, charge });

    const course = await Course.create({
        cid,
        title,
        creator: user.username, 
        charge
    });
    if(!user) return res.json("(SystemFailure_profileCreateMW_profileMW.js) Failed to create course");

    user.courses.push(cid);
    await user.save();
    if(!user) return res.json("(SystemFailure_profileCreateMW_profileMW.js) Failed to update course");

    next();
};

const profileCourseMW = async (req, res, next) => {
    const user = await User.findById(req.session.loginUser._id);
    if(!user) res.json("(DataNotFoundInDatabase_profileCourseMW_profileMW.js) Usernot found with the given id ");
    console.log("(SystemMessage_profileCourseMW_profileMW.js)");
    console.log(`user: ${user}`);

    const courses = user.courses;
    const cid = req.params.cid;
    console.log("(SystemMessage_profileCourseMW_profileMW.js)");
    console.log(`courses: ${courses}`);
    console.log(`cid: ${cid}`);
    if (courses.includes(cid)) return next();
    else return res.json("(UserMessage_profileCourseMW_profileMW.js) This course is not yours");
};

const profileCourseSendUpdateMW = async (req, res, next) => {
    const cid = req.params.cid;
    const { message } = req.body;
    console.log("(SystemMessage_profileCourseSendUpdateMW_profileMW.js)");
    console.log(`cid: ${cid}`);
    console.log(`message: ${message}`);

    const course = await Course.findOne({ cid });
    if(!course) res.json("(DataNotFoundInDatabase_profileCourseSendUpdateMW_profileMW.js) Course not found with the given cid ");
    console.log("(SystemMessage_profileCourseSendUpdateMW_profileMW.js)");
    console.log(`course: ${course}`);

    const students = course.students;
    console.log("(SystemMessage_profileCourseSendUpdateMW_profileMW.js)");
    console.log(`students: ${students}`);
    

    let recipients = [];
    for (var student of students) {
        console.log(`(SystemMessage_profileCourseSendUpdateMW_profileMW.js)`);
        console.log(`student: ${student}`);
        try{
            const student_temp = await User.findOne({ username: student });
            recipients.push(student_temp.email);
        } catch(e){
            console.log("(SystemMessage_profileCourseSendUpdateMW_profileMW.js)");
            console.log(`e: ${e}`);
            return res.json(`(SystemFailure_profileCourseSendUpdateMW_profileMW.js) User not found with the given username`);
        }
        
    }
    console.log("(SystemMessage_profileCourseSendUpdateMW_profileMW.js)");
    console.log(`recipients: ${recipients}`);

    try{
        await sendEmail(recipients, message);
    }
    catch(e){
        console.log("(SystemMessage_profileCourseSendUpdateMW_profileMW.js)");
        console.log(`e: ${e}`);
        return res.json("(SystemFailure_profileCourseSendUpdateMW_profileMW.js) Failed to send email");
    }
    

    next();
}

const profileUpdateInfoMW = async (req, res, next) => {
    let { fullname, country, social0, social1, social2 } = req.body;

    const user = await User.findOne({ email: req.session.loginUser.email });
    if(!user) return res.json("(SystemFailure_profileCourseSendUpdateMW_profileMW.js) User not found with the given email");

    console.log("(SystemMessage_profileUpdateInfoMW_profileMW.js)");
    console.log(`fullname: ${fullname}`);
    console.log(`country: ${country}`);
    console.log(`social0: ${social0}`);
    console.log(`social1: ${social1}`);
    console.log(`social2: ${social2}`);

    user.fullname = fullname;
    user.country = country;
    user.socials[0] = social0;
    user.socials[1] = social1;
    user.socials[2] = social2;
    try{
        await user.save();
    }
    catch(e){
        console.log("(SystemMessage_profileUpdateInfoMW_profileMW.js)");
        console.log(`e: ${e}`);
        return res.json("(SystemFailure_profileCourseSendUpdateMW_profileMW.js) Failed to update user");
    }
    

    next();
};

const profileReportMW  = async (req, res, next) => {
    const {message} = req.body;
    const user = await User.findOne({ email: req.session.loginUser.email });
    if(!user) return res.json("(SystemFailure_profileReportMW_profileMW.js) User not found with the given emeail");
    
    const problem = await Problem.create({
        description: message, 
        reported_by: user.username
    });
    if(!problem) return res.json("(SystemFailure_profileReportMW_profileMW.js) Failed to create problem");

    next();
};

const profileCourseContentUploadMW = async (req, res, next) => {
    if(!req.file || !req.body.description) return res.json("(UserMessage_profileCourseContentUploadMW_profileMW.js) Input data missing");
    console.log("(SystemMessage_profileCourseContentUploadMW_profileMW.js)");
    console.log(`req.file: ${req.file}`);
    console.log(`req.body.description: ${req.body.description}`);

    const  file_link = req.file.path;
    const description = req.body.description;
    try{
        const lesson = await Lesson.create({file_link, description});
        
        const content = await Content.create({
            lessons: [lesson._id]
        });

        const cid = req.params.cid;
        const course = await Course.findOne({ cid });
        course.contents.push(content._id);
        await course.save();

        next();
    } catch(e){
        console.log("(SystemMessage_profileCourseContentUploadMW_profileMW.js)");
        console.log(`e: ${e}`);
        return res.json("(SystemFailure_profileCourseContentUploadMW_profileMW.js) Failed to update course/create content/create lesson");
    }
};

const profileStudentMW = async (req, res, next) => {
    const user = await User.findById(req.session.loginUser._id);
    if(!user) res.json("(DataNotFoundInDatabase_profileStudentMW_profileMW.js) User not found with the given email");

    if (user.role !== 'student') return res.json("(UserMessage_profileStudentMW_profileMW.js) Service not availabe for you");
    next();
};

const profileAddCourseMW = async (req, res, next) => {
    const id = req.params.id;
    
    const {cid} = req.body;

    console.log("(SystemMessage_profileAddCourseMW_profileMW.js)");
    console.log("Reached this route");
    console.log(`id: ${id}`);
    console.log(`cid: ${cid}`);

    const user = await User.findById(id);
    const course = await Course.findOne({cid});

    if(!user || !course) return res.send("Message: Reached middleware funcation profileAddCourseMW (data not found in the database)");

    console.log("(SystemMessage_profileAddCourseMW_profileMW.js)");
    console.log(user);
    console.log(course);

    if (user.courses.includes(cid)) return res.send("Message: Reached middleware funcation profileAddCourseMW (course already exists in course list)");
    else if(user.cart.includes(cid)) return res.send("Message: Reached middleware funcation profileAddCourseMW (course pending in cart)");
    else{
        console.log("(SystemMessage_profileAddCourseMW_profileMW.js)");
        console.log(`course.charge= ${course.charge}`);
        console.log(`course.charge + 1= ${course.charge + 1}`);
        if(course.charge === 0.0){
            try{
                user.courses.push(cid);
                course.students.push(user.username);
                await user.save();
                await course.save();
                console.log("(SystemMessage_profileAddCourseMW_profileMW.js)");
                console.log("Free  course added in the course list");
            } catch(e){
                return res.send("Message: Reached middleware funcation profileAddCourseMW (failed to insert a free course in to the user's course list)");
            }
            
        } else{
            try{
                user.cart.push(cid);
                await user.save();
                console.log("(SystemMessage_profileAddCourseMW_profileMW.js)");
                console.log("Paid course added in the cart");
            } catch(e){
                return res.send("Message: Reached middleware funcation profileAddCourseMW (failed to insert a paid course in to the user's cart)");
            }
            
        }
    }

    next();
};

const profileAddDiscountMW = async (req, res, next) => {
    const user = await User.findById(req.session.loginUser._id);
    if(!user) res.json("(DataNotFoundInDatabase_profileAddDiscountMW_profileMW.js) Usernot found with the given id ");

    const {cid, discount} = req.body;
    const course = await Course.findOne({cid});
    if(!course) return res.json("(DataNotFoundInDatabase_profileAddDiscountMW_profileMW.js) Course not found with the given cid");

    if(!user.courses.includes(course.cid)) return res.json("(UserMessage_profileAddDiscountMW_profileMW.js) Not your course");

    if(course.charge === 0) return res.json("(UserMessage_profileAddDiscountMW_profileMW.js) Discount not availabe on free course");

    try{
        course.discount = discount;
        await course.save();
    }catch(e){
        return res.json("(SystemFailure_profileAddDiscountMW_profileMW.js) Failed to update course");
    }

    next();
};

const profileRemoveiscountMW = async (req, res, next) => {
    const user = await User.findById(req.session.loginUser._id);
    if(!user) res.json("(DataNotFoundInDatabase_profileRemoveiscountMW_profileMW.js) Usernot found with the given id ");

    const {cid} = req.body;
    const course = await Course.findOne({cid});
    if(!course) return res.json("(DataNotFoundInDatabase_profileAddDiscountMW_profileMW.js) Course not found with the given cid");

    if(!user.courses.includes(course.cid)) return res.json("(UserMessage_profileRemoveiscountMW_profileMW.js) Not your course");

    if(course.charge === 0) return res.json("(UserMessage_profileRemoveiscountMW_profileMW.js) Discount not availabe on free course");

    if(course.discount === 0) return res.json("(UserMessage_profileRemoveiscountMW_profileMW.js) Already no discount in this course");

    try{
        course.discount = 0;
        await course.save();
    }catch(e){
        return res.json("(SystemFailure_profileRemoveiscountMW_profileMW.js) Failed to update course");
    }

    next();
};

const profilePayMW = async (req, res, next) => {
    const id = req.params.id;

    const user = await User.findById(id);
    if(!user) return res.json(`(DataNotFoundInDatabase_profilePayMW_profileMW.js) User not found with the given id`);
    
    console.log("(SystemMessage_profilePayMW_profileMW.js) ");
    console.log(`user: ${user}`);
    console.log(`user.cart: ${user.cart}`);
    console.log(`user.courses: ${user.courses}`);

    var courses = [];
    for(var course of user.cart) {
        courses.push(course);
    }

    var totalPayment = 0.0;
    for(var course of courses){
        try{
            var c = await Course.findOne({cid: course});
            totalPayment = totalPayment + c.charge - (c.charge*(c.discount/100.0));
        } catch(e){
            return res.json("(DataNotFoundInDatabase_profilePayMW_profileMW.js) Course not found with the given cid (1)");
        }
    }

    if(totalPayment < 1) return res.json('(PaymentAmountError_profilePayMW_profileMW.js) Zero amounr can not be paid');

    const myStripe = stripe(process.env.STRIPE_SECRET_KEY);
    const amount = totalPayment*100;
    try {
        const charge = await myStripe.charges.create({
            amount,
            currency: 'usd',
            description: 'Payment for your service',
            source: req.body.stripeToken,
        });

        user.cart = [];
        await user.save();
        console.log("(SystemMessage_profilePayMW_profileMW.js)");
        console.log(`courses: ${courses}`);
        for(var course of courses){
            try{
                var c = await Course.findOne({cid: course});
                if(!c) res.json("(DataNotFoundInDatabase_profilePayMW_profileMW.js) Course not found with the given cid (2)");
                
                c.students.push(user.username);
                c.revenue = c.revenue + c.charge - (c.charge*(c.discount/100.0));
                user.courses.push(course);

                await c.save();
                await user.save();
            } catch(e){
                return res.json("(DataNotFoundInDatabase_profilePayMW_profileMW.js) Course not found with the given cid (3)");
            }
        }

    } catch (error) {
        console.error(error);
        res.json('(APIError_profilePayMW_profileMW.js) Payment with Stripe API failed');
    }
    next();
};

module.exports = {
    profileCreatorMW,
    profileCreateMW,
    profileCourseMW,
    profileCourseSendUpdateMW, 
    profileUpdateInfoMW, 
    profileReportMW, 
    profileCourseContentUploadMW, 
    profileStudentMW, 
    profileAddCourseMW, 
    profileAddDiscountMW, 
    profileRemoveiscountMW, 
    profilePayMW
};