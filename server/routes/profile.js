const express = require("express");
const router = express.Router();

// //route middlewares
const { auth } = require("../middlewares/auth");

// //fetching controllers
const {
  updateProfile,
  updateDisplayPicture,
  getAllUserDetails,
  deleteAccount,
  getEnrolledCourses,
} = require("../controllers/Profile");

// const {
//   resetPassword,
//   resetPasswordToken,
// } = require("../controllers/resetPassword");

// //routes

//authentication routes
router.put("/updateDisplayPicture", auth, updateDisplayPicture);
router.put("/updateProfile", auth, updateProfile);
router.get("/getUserDetails", auth, getAllUserDetails);
router.get("/getEnrolledCourses", auth, getEnrolledCourses);
router.delete("/deleteProfile", auth, deleteAccount);
// router.post("/changePassword", auth);

module.exports = router;
