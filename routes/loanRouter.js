const express = require("express");
const auth = require("../middlewares/auth");
const {
  createLoan,
  getLoans,
  getLoanOfCustomer,
  getSummaryOfLoans,
} = require("../controllers/loanController");
const router = express.Router();

router.post("/create", auth, createLoan);

router.get("/list", auth, getLoans);

router.get("/list/:customerId", auth, getLoanOfCustomer);

router.get("/summary", auth, getSummaryOfLoans);

module.exports = router;
