const express = require("express");
const router = express.Router();

// //fetching controllers
const {
  createCateogary,
  showAllCategories,
} = require("../controllers/Cateogary");
const { auth, isInstructor } = require("../middlewares/auth");
const { createCourse, getCourseDetails } = require("../controllers/Course");
const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section");
const { createSubSection } = require("../controllers/Subsection");

// //routes

//authentication routes
router.post("/createCategory", createCateogary);
router.get("/showAllCategories", showAllCategories);
// Courses can be created by instructor
router.post("/createCourse", auth, isInstructor, createCourse);
router.post("/addSection", auth, isInstructor, createSection);
router.get("/getCourseDetails", auth, isInstructor, getCourseDetails);
router.post("/addSubSection", auth, isInstructor, createSubSection);
router.post("/updateSection", auth, isInstructor, updateSection);
router.post("/deleteSection", auth, isInstructor, deleteSection);
module.exports = router;
