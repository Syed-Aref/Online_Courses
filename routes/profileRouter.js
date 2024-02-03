const express = require("express");
const profileRouter = express.Router();

const {sessionCheckerMW, privateMW} = require("../middlewares_new/commonMW");
const {
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
} = require("../middlewares_new/profileMW");

const {
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
} = require("../controller/profileCtrl");

const multer = require("multer");
const storage = require("../utils/cloudinary");
const upload = multer({ storage });

profileRouter.get("", privateMW, getProfile1);
profileRouter.get("/:id", privateMW, getProfile2);

profileRouter.get("/:id/createCourse", privateMW, profileCreatorMW, getProfileCreateCourse);
profileRouter.post("/:id/createCourse", privateMW, profileCreatorMW, profileCreateMW, postProfileCreateCourse);

profileRouter.get('/:id/course/:cid', privateMW, profileCreatorMW, profileCourseMW, getProfileCourse);

profileRouter.get('/:id/course/:cid/sendUpadate', privateMW, profileCreatorMW, profileCourseMW, getProfileCourseSendUpdate);
profileRouter.post('/:id/course/:cid/sendUpadate', privateMW, profileCreatorMW, profileCourseMW, profileCourseSendUpdateMW, postProfileCourseSendUpdate);

profileRouter.get('/:id/updateInfo', privateMW, getProfileUpdateInfo);
profileRouter.post('/:id/updateInfo', privateMW, profileUpdateInfoMW, postProfileUpdateInfo);

profileRouter.get('/:id/report', privateMW, getProfileReport);
profileRouter.post('/:id/report', privateMW, profileReportMW, postProfileReport);

profileRouter.get('/:id/courses', privateMW, getProfileCourses);

profileRouter.get('/:id/course/:cid/contentUpload', privateMW, profileCreatorMW, profileCourseMW, getProfileCourseContentUpload);
profileRouter.post('/:id/course/:cid/contentUpload', privateMW, upload.single("file"), profileCourseContentUploadMW, postProfileCourseContentUpload);

profileRouter.get('/:id/course/:cid/studentView', privateMW, profileStudentMW, profileCourseMW, getProfileCourseStudentView);

profileRouter.get('/:id/search', privateMW,profileStudentMW, getProfileSearch);
profileRouter.post('/:id/search', privateMW,profileStudentMW, postProfileSearh);

profileRouter.get('/:id/search/:searchTerm', privateMW,profileStudentMW, getProfileSearchSearchTerm);

profileRouter.post('/:id/addCousrse', privateMW, profileStudentMW, profileAddCourseMW, postProfileAddCourse);

profileRouter.get('/:id/addDiscount', privateMW, profileCreatorMW, getProfileAddDiscount);
profileRouter.post('/:id/addDiscount', privateMW, profileCreatorMW, profileAddDiscountMW, postProfileAddDiscount);

profileRouter.get('/:id/removeDiscount', privateMW, profileCreatorMW, getProfileRemoveDiscount);
profileRouter.post('/:id/removeDiscount', privateMW, profileCreatorMW, profileRemoveiscountMW, postProfileRemoveDiscount);

profileRouter.get('/:id/pay', privateMW, profileStudentMW, getProfilePay);
profileRouter.post('/:id/pay', privateMW, profileStudentMW, profilePayMW, postProfilePay);

profileRouter.get('/:id/insights', privateMW, profileCreatorMW, getProfileInsights);

module.exports = profileRouter;