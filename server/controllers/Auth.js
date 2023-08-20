const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");

const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/template/passwordUpdated");
require("dotenv").config();
//sendOtp
const otp = async (req, res) => {
  try {
    const { email } = req.body;
    const checkUserPresent = await User.findOne({ email });
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already registered",
      });
    }
    //generate otp
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("OTP generated : ", otp);
    // check unique otp or not
    let result = await OTP.findOne({ otp: otp });
    while (result) {
      otp = otpGenerator(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    }
    const optPayload = { email, otp };
    // create and entry for OTP
    const otpBody = await OTP.create(optPayload);
    console.log(otpBody);
    // return response successful
    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// const otp = async (req, res) => {
//   try {
//     const { email } = req.body;

//     const user = await User.findOne({ email: email });

//     //validation to check if user already exists
//     if (user) {
//       return res.status(400).json({
//         success: false,
//         message: "User already exists, LogIn!",
//       });
//     }

//     //generate otp
//     var otp = otpGenerator.generate(6, {
//       upperCaseAlphabets: false,
//       lowerCaseAlphabets: false,
//       specialChars: false,
//     });

//     //validate if otp created is already there in db
//     //const result = await Otp.findOne({otp:otp});

//     //a check for generating unique otps //bad practice but unique otp generator package not available

//     //if already in db regenerate otp
//     // while(result){
//     //     otp = otpGenerator.generate(6,{
//     //         upperCaseAlphabets:false,
//     //         lowerCaseAlphabets:false,
//     //         specialChars:false,
//     //     });

//     //     result = await Otp.findOne({otp:otp});
//     // };

//     //push new otp object to db which will trigger pre hook on db to send the mail
//     const pushOtp = await Otp.create({
//       otp: otp,
//       email: email,
//     });

//     if (pushOtp) {
//       console.log("otp pushed @-> ", Date.now());
//     }
//     //return res
//     res.status(200).json({
//       success: true,
//       message: "Otp sent successfully",
//     });
//   } catch (err) {
//     console.log("Error in otp generation flow , -> ", err);
//     return res.status(500).json({
//       success: false,
//       data: err.message,
//       message: "Something went wrong :) , try again!",
//     });
//   }
// };

// signup
// const signup = async (req, res) => {
//   // data from req body
//   const {
//     firstName,
//     lastName,
//     password,
//     confirmPassword,
//     email,
//     accountType,
//     otp,
//   } = req.body;
//   console.log(otp);
//   console.log(firstName);
//   try {
//     // validate data
//     if (
//       !firstName ||
//       !lastName ||
//       !email ||
//       !password ||
//       !confirmPassword ||
//       !otp
//     ) {
//       return res.status(403).json({
//         success: false,
//         message: "All fields are required",
//       });
//     }
//     // 2 password match
//     if (password !== confirmPassword) {
//       res.status(400).json({
//         success: false,
//         message:
//           "password and confirm password value not matching please try again",
//       });
//     }
//     // check user already exist or not
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: "User already registered ",
//       });
//     }
//     // find most recent otp for the user
//     const recentOtp = await OTP.find({ email })
//       .sort({ createdAt: -1 })
//       .limit(1);
//     console.log(recentOtp);
//     // validate the otp
//     if (recentOtp.length === 0) {
//       // no otp h
//       return res.status(400).json({
//         success: false,
//         message: "OTP not find",
//       });
//     } else if (otp !== recentOtp.otp) {
//       // invalid otp
//       return res.status(400).json({
//         success: false,
//         message: "Invalid OTP",
//       });
//     }
//     // hash password
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const ProfileDetails = await Profile.create({
//       gender: null,
//       dateOfBirth: null,
//       about: null,
//       contactNumber: null,
//     });
//     // entry in db
//     const user = await User.create({
//       firstName,
//       lastName,
//       email,
//       contactNumber,
//       password: hashedPassword,
//       accountType,
//       additionalDetails: ProfileDetails._id,
//       image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
//     });
//     // return res
//     return res.status(200).json({
//       success: true,
//       message: "User Registered Successfully",
//       user,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       success: false,
//       message: "User cannot register please try again",
//     });
//   }
// };
// const signup = async (req, res) => {
//   const {
//     firstName,
//     lastName,
//     email,
//     password,
//     confirmPassword,
//     accountType,
//     contactNumber,
//     otp,
//   } = req.body;
//   try {
//     // Destructure fields from the request body

//     // Check if All Details are there or not
//     if (
//       !firstName ||
//       !lastName ||
//       !email ||
//       !password ||
//       !confirmPassword ||
//       !otp
//     ) {
//       return res.status(403).send({
//         success: false,
//         message: "All Fields are required",
//       });
//     }
//     // Check if password and confirm password match
//     if (password !== confirmPassword) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Password and Confirm Password do not match. Please try again.",
//       });
//     }

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: "User already exists. Please sign in to continue.",
//       });
//     }

//     // Find the most recent OTP for the email
//     const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
//     console.log(response);
//     console.log(otp);
//     if (response.length === 0) {
//       // OTP not found for the email
//       return res.status(400).json({
//         success: false,
//         message: "The OTP is not valid res length 0",
//       });
//     } else if (otp !== response[0].otp) {
//       // Invalid OTP
//       return res.status(400).json({
//         success: false,
//         message: "The OTP is not valid",
//       });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create the user
//     let approved = "";
//     approved === "Instructor" ? (approved = false) : (approved = true);

//     // Create the Additional Profile For User
//     const profileDetails = await Profile.create({
//       gender: null,
//       dateOfBirth: null,
//       about: null,
//       contactNumber: null,
//     });
//     const user = await User.create({
//       firstName,
//       lastName,
//       email,
//       contactNumber,
//       password: hashedPassword,
//       accountType: accountType,
//       approved: approved,
//       additionalDetails: profileDetails._id,
//       image: "",
//     });

//     return res.status(200).json({
//       success: true,
//       user,
//       message: "User registered successfully",
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "User cannot be registered. Please try again.",
//     });
//   }
// };
const signup = async (req, res) => {
  if (req.body?.iss === "https://accounts.google.com") {
    //google sign up flow
    try {
      const { firstName, lastName, email, contactNumber, image } = req.body;

      const accountType = "Student";

      if (!firstName || !lastName || !email || !image) {
        return res.status(403).json({
          success: false,
          message: "All fields are required",
        });
      }

      const user = await User.findOne({ email: email });

      //validation to check if user already exists
      if (user) {
        return res.status(400).json({
          success: false,
          message: "User already exists, LogIn!",
        });
      }

      //null passwords for google sign up users
      const hashedPassword = null;

      let profileDetails = null;
      if (contactNumber) {
        profileDetails = await Profile.create({
          gender: null,
          dateOfBirth: null,
          about: null,
          contactNumber: contactNumber,
        });
      } else {
        profileDetails = await Profile.create({
          gender: null,
          dateOfBirth: null,
          about: null,
          contactNumber: null,
        });
      }

      const newUser = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        accountType,
        additionalDetails: profileDetails._id,
        //The image from google
        image: image,
      });

      res.status(200).json({
        success: true,
        message: "User is registered!",
      });
    } catch (err) {
      console.log("Err in signup flow-> ", err);
      return res.status(500).json({
        success: false,
        message: "User wasn't registrered. Please try again",
      });
    }
  } else {
    //normal signup flow

    try {
      const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        contactNumber,
        accountType,
        otp,
      } = req.body;

      if (
        !firstName ||
        !lastName ||
        !email ||
        !password ||
        !confirmPassword ||
        !otp
      ) {
        return res.status(403).json({
          success: false,
          message: "All fields are required",
        });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message:
            "Password and ConfirmPassword Value does not match, please try again",
        });
      }

      const user = await User.findOne({ email: email });

      //validation to check if user already exists
      if (user) {
        return res.status(400).json({
          success: false,
          message: "User already exists, LogIn!",
        });
      }

      const recentOtp = await OTP.find({ email: email })
        .sort({ createdAt: -1 })
        .limit(1);
      //const recentOtp = await Otp.find({email:email});

      if (recentOtp.length === 0) {
        // OTP not found for the email
        return res.status(400).json({
          success: false,
          message: "The OTP is not valid",
        });
      }

      if (otp !== recentOtp[0].otp) {
        return res.status(400).json({
          success: false,
          message: "invalid OTP",
        });
      }

      //implement password validations like Capital , small , special chr inclusion
      //otp matches

      const hashedPassword = await bcrypt.hash(password, 10);

      let profileDetails = null;
      if (contactNumber) {
        profileDetails = await Profile.create({
          gender: null,
          dateOfBirth: null,
          about: null,
          contactNumber: contactNumber,
        });
      } else {
        profileDetails = await Profile.create({
          gender: null,
          dateOfBirth: null,
          about: null,
          contactNumber: null,
        });
      }

      const newUser = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        accountType,
        additionalDetails: profileDetails._id,
        //The default image with initials as def DP
        image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}+${lastName}`,
      });

      res.status(200).json({
        success: true,
        message: "User is registered!",
      });
    } catch (err) {
      console.log("Err in signup flow-> ", err);
      return res.status(500).json({
        success: false,
        message: "User wasn't registrered. Please try again",
      });
    }
  }
};

//login
// const login = async (req, res) => {
//   // get data from req body
//   const { email, password } = req.body;
//   try {
//     // validate the data
//     if (!email || !password) {
//       return res.status(403).json({
//         success: false,
//         message: "All fields are required please try again",
//       });
//     }
//     // user check if exists
//     const user = await User.findOne({ email }).populate("additionalDetails");
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "User is not registered please signup first ",
//       });
//     }
//     // token generate jwt , after password matching
//     if (await bcrypt.compare(password, user.password)) {
//       const payload = {
//         email: user.email,
//         id: user._id,
//         accountType: user.accountType,
//       };
//       const token = jwt.sign(payload, process.env.JWT_SECRET, {
//         expiresIn: "2h",
//       });

//       user.token = token;
//       user.password = undefined;

//       // create cookie and send response
//       const options = {
//         expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
//         httpOnly: true,
//       };
//       res.cookie("token", token, options).status(200).json({
//         success: true,
//         token,
//         user,
//         message: "Logged in successfully",
//       });
//     } else {
//       return res.status(401).json({
//         success: false,
//         message: "password is incorrect",
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       success: false,
//       message: "Login failed please try again ",
//     });
//   }
// };

// Login controller for authenticating users
const login = async (req, res) => {
  try {
    // Get email and password from request body
    const { email, password } = req.body;

    // Check if email or password is missing
    if (!email || !password) {
      // Return 400 Bad Request status code with error message
      return res.status(400).json({
        success: false,
        message: `Please Fill up All the Required Fields`,
      });
    }

    // Find user with provided email
    const user = await User.findOne({ email }).populate("additionalDetails");

    // If user not found with provided email
    if (!user) {
      // Return 401 Unauthorized status code with error message
      return res.status(401).json({
        success: false,
        message: `User is not Registered with Us Please SignUp to Continue`,
      });
    }

    // Generate JWT token and Compare Password
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { email: user.email, id: user._id, role: user.role },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );

      // Save token to user document in database
      user.token = token;
      user.password = undefined;
      // Set cookie for token and return success response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: `User Login Success`,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: `Password is incorrect`,
      });
    }
  } catch (error) {
    console.error(error);
    // Return 500 Internal Server Error status code with error message
    return res.status(500).json({
      success: false,
      message: `Login Failure Please Try Again`,
    });
  }
};
//changePassword
// Controller for Changing Password
const changePassword = async (req, res) => {
  try {
    // Get user data from req.user
    const userDetails = await User.findById(req.user.id);

    // Get old password, new password, and confirm new password from req.body
    const { oldPassword, newPassword } = req.body;
    // Validate old password
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password
    );
    if (!isPasswordMatch) {
      // If old password does not match, return a 401 (Unauthorized) error
      return res
        .status(401)
        .json({ success: false, message: "The password is incorrect" });
    }

    // Update password
    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true }
    );

    // Send notification email
    try {
      const emailResponse = await mailSender(
        updatedUserDetails.email,
        "Password for your account has been updated",
        passwordUpdated(
          updatedUserDetails.email,
          `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
        )
      );
      console.log("Email sent successfully:", emailResponse.response);
    } catch (error) {
      // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while sending email:", error);
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      });
    }

    // Return success response
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
    console.error("Error occurred while updating password:", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: error.message,
    });
  }
};
module.exports = {
  signup,
  otp,
  login,
  changePassword,
};
