const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const { courseEnrollment } = require("../mail/template/courseEnrolllmentEmail");

// capture the payment and initiate the Razorpay order
exports.capturePayment = async (req, res) => {
  // get courseId and userId
  const { course_id } = req.body;
  const userId = req.user.id;

  // validation
  if (!couse_id) {
    return req.json({
      success: false,
      message: "please Provide valid course Id",
    });
  }
  // valid courseId
  let course;
  try {
    course = await Course.findById(course_id);
    if (!course) {
      return res.json({
        success: false,
        message: "Could not find the course",
      });
    }
    // user already buyed the same course of not
    // converting object to string ie userId to string
    const uid = new mongoose.Types.ObjectId(userId);

    // user already pay for the same course
    if (course.studentsEnrolled.includes(uid)) {
      return res.status(200).json({
        success: false,
        message: "Student is already enrolled",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
  // valid CourseDetails
  // order create
  const amount = course.price;
  const currency = "INR";
  const options = {
    amount: amount * 100,
    currency,
    receipt: Math.random(Date.now()).toString(),
    notes: {
      courseId: course_id,
      userId,
    },
  };
  try {
    // initiate the payment using razorpay
    const paymentResponse = await instance.orders.create(options);
    console.log(paymentResponse);
    return res.status(200).json({
      success: true,
      courseName: course.courseName,
      courseDescription: course.courseDescription,
      thumbnail: course.thumbnail,
      orderId: paymentResponse.orderId,
      currency: paymentResponse.currency,
      amount: paymentResponse.amount,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Could not initiate order",
    });
  }
  // return res
};
// verify Signature of Razorpay and Server
exports.verifySignature = async (req, res) => {
  const webhookSecret = "12345678";
  // getting from razorpay
  const signature = req.headers("x-razorpay-signature");

  const shasum = crypto.createHmac("sha256", webhookSecret);
  // converting to string
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");
  if (signature === digest) {
    console.log("Payment is Authorised");
    const { courseId, userId } = req.body.payload.payment.entity.notes;
    try {
      // fulfil action ie enroll student
      // find course and enroll in course
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: userId } },
        { new: true }
      );
      if (!enrolledCourse) {
        return req.status(500).json({
          success: false,
          message: "Course not found",
        });
      }
      console.log(enrolledCourse);
      // find the student and add the course to their list enrolled courses me
      const enrolledStudent = await User.findOneAndUpdate(
        { _id: userId },
        { $push: { courses: courseId } },
        { new: true }
      );
      console.log(enrolledStudent);
      // mail send confirm ka
      const emailResponse = await mailSender(
        enrolledStudent.email,
        "congratulation from rohan sir",
        "Congrats you are welcome to course"
      );
      console.log(emailResponse);
      return res.status(200).json({
        success: true,
        message: "Signature Verified and Course Added ",
      });
    } catch (error) {
      console.log(error);
      return req.status(500).json({
        success: false,
        message: error.message,
      });
    }
  } else {
    return res.status(400).json({
      success: false,
      message: "Invalid request",
    });
  }
};
