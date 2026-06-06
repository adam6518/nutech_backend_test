const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getBalance,
  topup,
  transaction,
  getTransactionHistory,
} = require("../controllers/transactionController");

router.get("/balance", authMiddleware, getBalance);
router.post("/topup", authMiddleware, topup);
router.post("/transaction", authMiddleware, transaction);
router.get("/transaction/history", authMiddleware, getTransactionHistory);

module.exports = router;
