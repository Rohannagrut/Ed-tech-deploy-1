const Profile = require("../models/Profile");
const User = require("../models/User");
const mongoose = require("mongoose");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
// exports.updateProfile = async (req, res) => {
//   try {
//     const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;
//     // get user
//     const id = req.user.id;
//     // validation
//     if (!contactNumber || !gender || !id) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required ",
//       });
//     }
//     // find profile
//     const userDetails = await User.findById(id);
//     const profileId = userDetails.additionalDetails;
//     const profileDetails = await Profile.findById(profileId);
//     // update profile
//     profileDetails.dateOfBirth = dateOfBirth;
//     profileDetails.about = about;
//     profileDetails.contactNumber = contactNumber;
//     profileDetails.gender = gender;
//     await profileDetails.save();
//     // return success res
//     return res.status(200).json({
//       success: true,
//       message: "Profile updated successfully",
//       profileDetails,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Unable to Update Profile Details , please try again ",
//       error: error.message,
//     });
//   }
// };

// exports.updateProfile = async (req, res) => {
//   try {
//     const {
//       firstName = "",
//       lastName = "",
//       dateOfBirth = "",
//       about = "",
//       contactNumber = "",
//       gender = "",
//     } = req.body;
//     const id = req.user.id;

//     // Find the profile by id
//     console.log(id);
//     const userDetails = await User.findById(id);
//     const profile = await Profile.findById(userDetails.additionalDetails);

//     const user = await User.findByIdAndUpdate(id, {
//       firstName,
//       lastName,
//     });
//     await user.save();

//     // Update the profile fields
//     profile.dateOfBirth = dateOfBirth;
//     profile.about = about;
//     profile.contactNumber = contactNumber;
//     profile.gender = gender;

//     // Save the updated profile
//     await profile.save();

//     // Find the updated user details
//     const updatedUserDetails = await User.findById(id)
//       .populate("additionalDetails")
//       .exec();

//     return res.json({
//       success: true,
//       message: "Profile updated successfully",
//       updatedUserDetails,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       success: false,
//       error: error.message,
//     });
//   }
// };
exports.updateProfile = async (req, res) => {
  try {
    const {
      firstName = "",
      lastName = "",
      dateOfBirth = "",
      about = "",
      contactNumber = "",
      gender = "",
    } = req.body;
    const id = req.user.id;

    // Find the profile by id
    const userDetails = await User.findById(id);
    const profile = await Profile.findById(userDetails.additionalDetails);

    const user = await User.findByIdAndUpdate(id, {
      firstName,
      lastName,
    });
    await user.save();

    // Update the profile fields
    profile.dateOfBirth = dateOfBirth;
    profile.about = about;
    profile.contactNumber = contactNumber;
    profile.gender = gender;

    // Save the updated profile
    await profile.save();

    // Find the updated user details
    const updatedUserDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();

    return res.json({
      success: true,
      message: "Profile updated successfully",
      updatedUserDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
// delete account
//Explore=> how can we schedule this deletion account
exports.deleteAccount = async (req, res) => {
  try {
    // get user id

    const id = req.user.id;
    // console.log("printing id", id);
    // validation
    const userDetails = await User.findById(id);

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "User not found ",
      });
    }
    // delete profile first then go for user
    // to do hw unenroll user from all enrolled courses
    await Profile.findByIdAndDelete({
      _id: userDetails.additionalDetails,
    });
    await User.findByIdAndDelete({ _id: id });
    // return success res
    return res.status(200).json({
      success: true,
      message: "Profile and User Deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to Delete Profile and user, please try again ",
      error: error.message,
    });
  }
};
exports.getAllUserDetails = async (req, res) => {
  try {
    // get user id
    const id = req.user.id;
    // validation
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();

    return res.status(200).json({
      success: true,
      message: "User data fetched  successfully",
      userDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch user details in profile, please try again ",
      error: error.message,
    });
  }
};
// exports.updateDisplayPicture = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const displayPicture = req.files.displayPicture;
//     const image = await uploadImageToCloudinary(
//       displayPicture,
//       process.env.FOLDER_NAME,
//       1000,
//       1000
//     );
//     console.log(image, "ye rahi aapki image");
//     const updatedProfile = await User.findByIdAndUpdate(
//       {
//         _id: userId,
//       },
//       { image: image.secure_url },
//       { new: true }
//     );
//     res.send({
//       success: true,
//       message: "Image updated successfully",
//       data: updatedProfile,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: `${error.message} yar error ara h while uploading profile image `,
//     });
//   }
// };
exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture;
    const userId = req.user.id;
    console.log(userId);
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    );
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    );
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// module.exports = { updateDisplayPicture };
exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    const userDetails = await User.findOne({
      _id: userId,
    })
      .populate("courses")
      .exec();
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      });
    }
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
