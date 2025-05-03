const User = require("../models/userModel");
const {
  validateSignUpDetails,
  validateLoginDetails,
} = require("../utils/validations");
const bcrypt = require("bcryptjs");
// User Registration
const userRegistration = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    // Validate the incoming data
    validateSignUpDetails(req.body);
    // Check the User exists before or not
    const isExistingUser = await User.findOne({ email });
    if (isExistingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // hash the password and create a new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
    });
    // Save the  User in DB
    await newUser.save();
    res.status(201).json({
      message: "User Registered Successfully",
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// User Login
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validate them
    validateLoginDetails(req.body);
    // Check the User exists before or not
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "You don't have an account, Please Register" });
    }
    // Check the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    // Generate JWT token
    const token = user.generateJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    }); // 7days to expire
    res.json({
      message: "Login Successfull",
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { userRegistration, userLogin };
