const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const uploadMiddleware = require("../middleware/uploadMiddleware");

const {
  getProfileUser,
  updateProfileUser,
  updateProfileImage
} = require("../controllers/profileController");

router.get("/profile", authMiddleware, getProfileUser);
router.put("/profile/update", authMiddleware, updateProfileUser);
router.put("/profile/image", authMiddleware, uploadMiddleware.single("file"), updateProfileImage);

module.exports = router;
