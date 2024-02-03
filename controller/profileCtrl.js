const User = require("../models/User");
const Course = require("../models/Course");
const content = require("../models/Content");
const Lesson = require("../models/Lesson");
const Content = require("../models/Content");

const getProfile1 = async (req, res) => {
    const user = await User.findOne({ email: req.session.loginUser.email });
    if(!user) return res.json(`(DataNotFoundInDatabase_getProfile1_profileCtrl.js) User not found with the given email`);
    res.redirect(`/profile/${user._id}`);
};

const getProfile2 = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) return res.render("profile", { user });
    else return res.json("(DataNotFoundInDatabase_getProfile2_profileCtrl.js) User not found with the given id");
};

const getProfileCreateCourse = async (req, res) => {
    const user = await User.findById(req.params.id);
    if(!user) return res.json("(DataNotFoundInDatabase_getProfileCreateCourse_profileCtrl.js) User not found with the given id");
    res.render(`profile-createCourse`, {user});
};

const postProfileCreateCourse = async (req, res) => {
    res.redirect(`/profile`);
};

const getProfileCourse = async (req, res) => {
    const id = req.params.id;
    const cid = req.params.cid;
    const user = await User.findById(id);
    if(!user) return res.json(`(DataNotFoundInDatabase_getProfileCourse_profileCtrl.js) User not found with the given id`);
    const course = await Course.findOne({ cid });
    if(!course) return res.json(`(DataNotFoundInDatabase_getProfileCourse_profileCtrl.js) Course not found with the given cid`);
    console.log("(SystemMessage_getProfileCourse_profileCtrl.js) ");
    console.log(`user: ${user}`);
    console.log(`course: ${course}`);
    console.log(`course.contents.length: ${course.contents.length}`);
    res.render(`profile-course`, { user, course });
};

const getProfileCourseSendUpdate = async (req, res) => {
    const id = req.params.id;
    const cid = req.params.cid;
    const user = await User.findById(id);
    if(!user) return res.json(`(DataNotFoundInDatabase_getProfileCourseSendUpdate_profileCtrl.js) User not found with the given id`);
    const course = await Course.findOne({ cid });
    if(!course) return res.json(`(DataNotFoundInDatabase_getProfileCourseSendUpdate_profileCtrl.js) Course not found with the given cid`);
    console.log("(SystemMessage_getProfileCourseSendUpdate_profileCtrl.js) ");
    console.log(`user: ${user}`);
    console.log(`course: ${course}`);
    res.render(`profile-course-sendUpdate`, { user, course });
};

const postProfileCourseSendUpdate = async (req, res) => {
    const cid = req.params.cid;
    const course = await Course.findOne({ cid });
    if(!course) return res.json(`(DataNotFoundInDatabase_postProfileCourseSendUpdate_profileCtrl.js) Course not found with the given cid`);
    console.log("(SystemMessage_postProfileCourseSendUpdate_profileCtrl.js) ");
    console.log(`course: ${course}`);
    res.redirect(`/profile`);
}

const getProfileUpdateInfo = async (req, res) => {
    const user = await User.findOne({ email: req.session.loginUser.email });
    if (user) {
        console.log("(SystemMessage_getProfileUpdateInfo_profileCtrl.js) ");
        console.log(`user: ${user}`);
        return res.render("profile-updateInfo", { user });
    }
    else return res.json("(DataNotFoundInDatabase_getProfileUpdateInfo_profileCtrl.js) User not found with the given email");
};

const postProfileUpdateInfo = async (req, res) => {
    res.redirect("/profile");
};

const getProfileReport = async (req, res) => {
    const user = await User.findOne({ email: req.session.loginUser.email });
    if(user) return res.render("proifle-report", {user});
    else return res.json("(DataNotFoundInDatabase_getProfileUpdateInfo_profileCtrl.js) User not found with the given email");
};

const postProfileReport = async (req, res) => {
    res.redirect('/profile');
};

const getProfileCourses = async (req, res) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if(!user) return res.json(`(DataNotFoundInDatabase_getProfileCourses_profileCtrl.js) User not found with the given id`);
    const target_courses = user.courses;
    const courses = await Course.find({
        cid: {
            $in: target_courses
        }
    });
    console.log("(SystemMessage_getProfileCourses_profileCtrl.js) ");
    console.log(`user: ${user}`);
    console.log(`courses: ${courses}`);
    res.render(`profile-courses`, { user, courses });
};

const getProfileCourseContentUpload = async (req, res) => {
    const id = req.params.id;
    const cid = req.params.cid;
    const user = await User.findById(id);
    if(!user) return res.json(`(DataNotFoundInDatabase_getProfileCourseContentUpload_profileCtrl.js) User not found with the given id`);
    const course = await Course.findOne({ cid });
    if(!course) return res.json(`(DataNotFoundInDatabase_getProfileCourseContentUpload_profileCtrl.js) Course not found with the given cid`);
    console.log("(SystemMessage_getProfileCourseContentUpload_profileCtrl.js) ");
    console.log(`user: ${user}`);
    console.log(`course: ${course}`);
    res.render("profile-course-contentUpload", {course});
};

const postProfileCourseContentUpload = async (req, res) => {
    const id = req.params.id;
    const cid = req.params.cid;
    const user = await User.findById(id);
    if(!user) return res.json(`(DataNotFoundInDatabase_postProfileCourseContentUpload_profileCtrl.js) User not found with the given id`);
    const course = await Course.findOne({ cid });
    if(!course) return res.json(`(DataNotFoundInDatabase_postProfileCourseContentUpload_profileCtrl.js) Course not found with the given cid`);
    console.log("(SystemMessage_postProfileCourseContentUpload_profileCtrl.js) ");
    console.log(`user: ${user}`);
    console.log(`course: ${course}`);
    console.log(`course.contents.length: ${course.contents.length}`);
    res.render(`profile-course`, { user, course });
};

const getProfileCourseStudentView = async (req, res) => {
    const id = req.params.id;
    const cid = req.params.cid;
    const user = await User.findById(id);
    if(!user) return res.json(`(DataNotFoundInDatabase_getProfileCourseStudentView_profileCtrl.js) User not found with the given id`);
    const course = await Course.findOne({ cid });
    if(!course) return res.json(`(DataNotFoundInDatabase_getProfileCourseStudentView_profileCtrl.js) Course not found with the given cid`);
    console.log("(SystemMessage_getProfileCourseStudentView_profileCtrl.js) ");
    console.log(`user: ${user}`);
    console.log(`course: ${course}`);
    console.log(`course.contents.length: ${course.contents.length}`);
    let weeklyContents = [];
    for(var content_id of course.contents){
        const content = await Content.findById(content_id);
        if(!content) return res.json(`(DataNotFoundInDatabase_getProfileCourseStudentView_profileCtrl.js) Content not found with the given content_id`);
        let lessons = [];
        for(var lesson_id of content.lessons){
            const lesson = await Lesson.findById(lesson_id);
            if(!lesson) return res.json(`(DataNotFoundInDatabase_getProfileCourseStudentView_profileCtrl.js) Lesson not found with the given lesson_id`);
            lessons.push(lesson);
        }
        weeklyContents.push(lessons);
    }
    console.log("(SystemMessage_getProfileCourseStudentView_profileCtrl.js) ");
    console.log(`So far weekly contents: of ${cid}`);
    console.log(`weeklyContents: ${weeklyContents}`);
    res.render(`profile-course-studentView`, { user, course, weeklyContents });
};

const getProfileSearch = async (req, res) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if(!user) return res.json(`(DataNotFoundInDatabase_getProfileCourses_profileCtrl.js) User not found with the given id`);
    
    var course_cid_list = [];
    var course_title_list = [];
    var course_charge_list = [];
    res.render(`profile-search`, {user, course_cid_list, course_title_list, course_charge_list});
};

const postProfileSearh = async (req, res) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if(!user) return res.json(`(DataNotFoundInDatabase_getProfileCourses_profileCtrl.js) User not found with the given id`);
    const {searchTerm} = req.body;
    console.log("(SystemMessage_postProfileSearh_profileCtrl.js) ");
    console.log(`searchTerm: ${searchTerm}`);
    res.redirect(`/profile/${user._id }/search/${searchTerm}`);
};

const getProfileSearchSearchTerm = async (req, res) => {
    const id = req.params.id;
    const searchTerm = req.params.searchTerm;

    const user = await User.findById(id);
    if(!user) return res.json(`(DataNotFoundInDatabase_getProfileCourses_profileCtrl.js) User not found with the given id`);

    var searchQuery; 
    var courses;
    var course_cid_list = [];
    var course_title_list = [];
    var course_charge_list = [];

    try{
        searchQuery = { cid: { $regex: new RegExp(searchTerm, 'i') } };
        courses = await Course.find(searchQuery);
        for(var course of courses) {
            course_title_list.push(course.title);
            course_cid_list.push(course.cid);
            course_charge_list.push(course.charge);
        }

        searchQuery = { cid: { $regex: new RegExp(searchTerm, 'i') } };
        courses = await Course.find(searchQuery);
        for(var course of courses) {
            if(!course_cid_list.includes(course.cid)){
                course_title_list.push(course.title);
                course_cid_list.push(course.cid);
                course_charge_list.push(course.charge);
            }
        }
    } catch(e){
        console.log("(SystemMessage_getProfileSearchSearchTerm_profileCtrl.js) ");
        console.log(`e: ${e}`);
    }

    console.log("(SystemMessage_getProfileSearchSearchTerm_profileCtrl.js) ");
    console.log(`course_cid_list: ${course_cid_list}`);
    console.log(`course_title_list: ${course_title_list}`);
    res.render(`profile-search`, {user, course_cid_list, course_title_list, course_charge_list});
};

const postProfileAddCourse = (req, res) => {
    res.send("Message: Reached controller function postProfileAddCourse");
};

const getProfileAddDiscount = async (req, res) => {
    const id = req.params.id;

    const user = await User.findById(id);
    if(!user) return res.json(`(DataNotFoundInDatabase_getProfileAddDiscount_profileCtrl.js) User not found with the given id`);
    
    res.render("profile-addDiscount", {user});
};

const postProfileAddDiscount = async (req, res) => {
    res.redirect('/profile');
};

const getProfileRemoveDiscount = async (req, res) => {
    const id = req.params.id;

    const user = await User.findById(id);
    if(!user) return res.json(`(DataNotFoundInDatabase_getProfileAddDiscount_profileCtrl.js) User not found with the given id`);
    
    res.render("profile-removeDiscount", {user});
};

const postProfileRemoveDiscount = async (req, res) => {
    res.redirect('/profile');
};

const getProfilePay = async (req, res) => {
    const id = req.params.id;

    const user = await User.findById(id);
    if(!user) return res.json(`(DataNotFoundInDatabase_getProfilePay_profileCtrl.js) User not found with the given id`);
    
    console.log("(SystemMessage_getProfilePay_profileCtrl.js) ");
    console.log(`user: ${user}`);
    console.log(`user.cart: ${user.cart}`);
    console.log(`user.courses: ${user.courses}`);

    var courses = [];
    for(var course of user.cart) {
        courses.push(course);
    }

    var totalPayment = 0.0;
    var course_titles = [];
    for(var course of courses){
        try{
            var c = await Course.findOne({cid: course});
            totalPayment = totalPayment + c.charge - (c.charge*(c.discount/100.0));
            course_titles.push(c.title);
        } catch(e){
            return res.json("(DataNotFoundInDatabase_getProfilePay_profileCtrl.js) Course not found with the given cid");
        }
    }

    console.log("(SystemMessage_getProfilePay_profileCtrl.js) ");
    console.log(`courses: ${courses}`);
    console.log(`totalPayment: ${totalPayment}`);
    res.render('profile-pay', {user, courses, course_titles, totalPayment});
};

const postProfilePay = async (req, res) => {
    res.redirect("/profile");
}

const getProfileInsights = async (req, res) => {
    const id = req.params.id;

    const user = await User.findById(id);
    if(!user) return res.json(`(DataNotFoundInDatabase_getProfileInsights_profileCtrl.js) User not found with the given id`);
    
    const courses = [];
    var totalStudent = 0;
    var totalRevenue = 0.0;

    for(var cid of user.courses){
        var course = await Course.findOne({cid});
        var revenue;
        if(course.charge === 0) revenue = "Free Course";
        else revenue = course.revenue;

        courses.push({
            title: course.title, 
            students: course.students.length, 
            revenue
        });
    }

    res.render('profile-insights', {courses});
};

module.exports = {
    getProfile1, getProfile2,
    getProfileCreateCourse, postProfileCreateCourse,
    getProfileCourse,
    getProfileCourseSendUpdate, postProfileCourseSendUpdate,
    getProfileUpdateInfo, postProfileUpdateInfo, 
    getProfileReport, postProfileReport, 
    getProfileCourses, 
    getProfileCourseContentUpload, postProfileCourseContentUpload, 
    getProfileCourseStudentView, 
    getProfileSearch, postProfileSearh, 
    getProfileSearchSearchTerm, 
    postProfileAddCourse, 
    getProfileAddDiscount, postProfileAddDiscount, 
    getProfileRemoveDiscount, postProfileRemoveDiscount, 
    getProfilePay, postProfilePay, 
    getProfileInsights
};