const express = require("express");
const router = express.Router();
const {
  userRegistration,
  userLogin,
  getUserInfo,
  logout,
} = require("../controllers/userController.js");
const auth = require("../middlewares/auth.js");

router.post("/sign-up", userRegistration);
router.post("/login", userLogin);
router.get("/profile", auth, getUserInfo);
router.post('/logout',auth,logout)

module.exports = router;
