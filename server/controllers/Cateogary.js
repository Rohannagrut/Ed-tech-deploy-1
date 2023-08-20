const Cateogary = require("../models/Cateogary");
const Category = require("../models/Cateogary");
exports.createCateogary = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    // create entry in db

    const CateogaryDetails = await Cateogary.create({
      name: name,
      description: description,
    });
    console.log(CateogaryDetails);
    res.status(200).json({
      success: true,
      message: "Tag created successfully ",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.showAllCategories = async (req, res) => {
  try {
    console.log("INSIDE SHOW ALL CATEGORIES");
    const allCategorys = await Category.find({});
    res.status(200).json({
      success: true,
      data: allCategorys,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Category Page Details
exports.categoryPageDetails = async (req, res) => {
  try {
    // get cateogary id
    const { categoryId } = req.body;
    // get courses for specified cateogary id
    const selectCategory = await Cateogary.findById(categoryId)
      .populate("courses")
      .exec();
    // validation
    if (!selectCategory) {
      return res.status(404).json({
        success: false,
        message: "Data Not Found",
      });
    }
    // get courses for different category
    const differentCategories = await Cateogary.find({
      _id: { $ne: categoryId },
    })
      .populate("courses")
      .exec();
    // get top selling courses
    // hw -write get top

    // return res
    return res.status(200).json({
      success: true,
      data: {
        selectCategory,
        differentCategories,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
