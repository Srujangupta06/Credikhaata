const express = require("express");
const {
  loanRepayment,
  getLoanRepayments,
} = require("../controllers/repaymentController");
const auth = require("../middlewares/auth");
const router = express.Router();

router.post("/:loanId", auth, loanRepayment);

router.get("/list", auth, getLoanRepayments);

module.exports = router;
