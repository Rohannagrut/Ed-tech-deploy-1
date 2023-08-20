const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
// const SubSection = require("../models/SubSection");
// create subsection
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.createSubSection = async (req, res) => {
  try {
    // data fetch
    const { sectionId, title, timeDuration, description } = req.body;
    // extract file/video
    const video = req.files.videoFile;
    // validation
    if (!sectionId || !title || !timeDuration || !description)
      return res.status(400).json({
        success: false,
        message: "All fields are required in subsection",
      });
    console.log(video);
    // upload on cloudinary
    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );
    console.log(uploadDetails);
    // get secure url and put in subsection
    // create section
    const SubSectionDetails = await SubSection.create({
      title: title,
      timeDuration: timeDuration,
      description: description,
      videoUrl: uploadDetails.secure_url,
    });

    //update the section with subsection objectId
    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $push: {
          subSection: SubSectionDetails._id,
        },
      },
      { new: true }
    ).populate("subSection");
    // long updated section here after adding populate query
    // return success res
    return res.status(200).json({
      success: true,
      message: "SubSection created successfully",
      updatedSection,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to create SubSection , please try again ",
      error: error.message,
    });
  }
};
// hw update subsection
// delete subsection
