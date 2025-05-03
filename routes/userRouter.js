const express = require("express");
const router = express.Router();
const { userRegistration, userLogin } = require("../controllers/userController.js");
router.post("/sign-up", userRegistration);
router.post("/login", userLogin);

module.exports = router;
