const express = require("express");
const router = express.Router();
const {
  createCustomer,
  updateCustomer,
  removeCustomer,
  getCustomers,
  getCustomer,
} = require("../controllers/customerController");
const auth = require("../middlewares/auth");

router.post("/create", auth, createCustomer);
router.get("/list", auth, getCustomers);
router.get("/list/:customerId", auth, getCustomer);
router.patch("/edit/:customerId", auth, updateCustomer);
router.delete("/remove/:customerId", auth, removeCustomer);

module.exports = router;
