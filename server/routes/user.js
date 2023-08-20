const express = require("express");
const router = express.Router();

// //route middlewares
// const { auth } = require("../middlewares/auth");

// //fetching controllers
const {
  signup,
  sendOTP,
  otp,
  login,
  changePassword,
} = require("../controllers/Auth");
const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/ResetPassword");
const { auth } = require("../middlewares/auth");

// const {
//   resetPassword,
//   resetPasswordToken,
// } = require("../controllers/resetPassword");

// //routes

//authentication routes
router.post("/sendOtp", otp);
router.post("/signup", signup);
router.post("/login", login);
router.post("/changePassword", auth, changePassword);

router.post("/reset-password-token", resetPasswordToken); //reset password routes
router.post("/reset-password", resetPassword); //check this -> /:token ??

module.exports = router;
