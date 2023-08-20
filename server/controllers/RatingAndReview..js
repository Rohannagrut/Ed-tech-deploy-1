const RatingAndReviews = require("../models/RatingAndReview");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");

// createRating
exports.createRating = async (req, res) => {
  // get user id
  const userId = req.user.id;
  // get data
  const { rating, review, courseId } = req.body;

  // check for enrollment
  try {
    const CourseDetails = await Course.findOne({
      _id: courseId,
      studentsEnrolled: { $eleMatch: { $eq: userId } },
    });
    if (!CourseDetails) {
      return res.status(404).json({
        success: false,
        message: "Stuedent not enrolled in this course",
      });
    }
    // check if user has already reviewed
    const alreadyReviewed = await RatingAndReviews.findOne({
      user: userId,
      course: courseId,
    });
    if (alreadyReviewed) {
      return res.status(403).json({
        success: false,
        message: "Course is already reviewed by the user",
      });
    }
    // create rating and review
    const ratingReview = await RatingAndReviews.create({
      rating,
      review,
      course: courseId,
      user: userId,
    });
    // attach with course ie rating and review
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      { _id: courseId },
      {
        $push: {
          ratingAndReviews: ratingReview._id,
        },
      },
      { new: true }
    );
    console.log(updatedCourseDetails);
    // return res--
    return res.status(200).json({
      success: true,
      message: "Rating and review created Successfully created ",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// getAverageRating
exports.getAverageRating = async (req, res) => {
  try {
    // get id
    const courseId = req.body.courseId;
    // calculate avg
    const result = await RatingAndReviews.aggregate([
      {
        $match: {
          // string to object id
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          // jitne entry aye usko single group me wrap kar diya
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);
    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        averageRating: result[0].averageRating,
      });
    }
    // if no rating review exists
    return res.status(200).json({
      success: true,
      message: "Average rating is 0, no ratings given till now ",
      averageRating: 0,
    });
    // return rating
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// getAllRating

exports.getAllRating = async (req, res) => {
  try {
    const allReviews = await RatingAndReviews.find({})
      .sort({
        rating: "desc",
      })
      .populate({
        path: "user",
        select: "firstName lastName email image",
      })
      .populate({
        path: "course",
        select: "courseName",
      })
      .exec();
    return res.status(200).json({
      success: true,
      message: "All reviews fetched successfully",
      data: allReviews,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: true,
      message: error.message,
    });
  }
};
// based on course rating review make
