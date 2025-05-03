const express = require("express");
const auth = require("../middlewares/auth");
const { createLoan, getLoans } = require("../controllers/loanController");
const router = express.Router();

router.post("/create", auth, createLoan);

router.get("/list", auth, getLoans);

module.exports = router;
