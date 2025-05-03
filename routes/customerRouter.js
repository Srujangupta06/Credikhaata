const express = require("express");
const router = express.Router();
const {
  createCustomer,
  updateCustomer,
  removeCustomer,
} = require("../controllers/customerController");
const auth = require("../middlewares/auth");

router.post("/create",auth, createCustomer);
router.patch("/edit/:customerId",auth, updateCustomer);
router.delete("/remove/:customerId",auth, removeCustomer);

module.exports = router;
