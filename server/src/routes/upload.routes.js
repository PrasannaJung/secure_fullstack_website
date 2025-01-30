const router = require("express").Router();

const ApiResponse = require("../utils/ApiResponse");
const handleUpload = require("../utils/upload.config");

router.post("/upload", handleUpload, (req, res) => {
  console.log(req.files);
  // send the response as /uploads/serviceimage/imagename.jpg for service image and /uploads/profileimage/imagename.jpg for profile image and at once only one image will be uploaded
  if (!req.files) {
    return res.status(400).json(new ApiResponse(400, "No file uploaded"));
  }

  if (req.files.serviceImage) {
    const serviceImage =
      "/uploads/serviceimage/" + req.files.serviceImage[0].filename;

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Service image uploaded successfully",
          serviceImage,
        ),
      );
  } else if (req.files.profileImage) {
    const profileImage =
      "/uploads/profileimage/" + req.files.profileImage[0].filename;

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Profile image uploaded successfully",
          profileImage,
        ),
      );
  }
});

module.exports = router;
