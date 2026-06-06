const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { getBanner, getServices } = require("../controllers/infoController");

router.get("/banner", getBanner);
router.get("/services", authMiddleware, getServices);

module.exports = router;
