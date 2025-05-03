const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const auth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Please login to continue" });
    }
    // If token exist, verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const { userId } = decodedToken;
    // Check whether the user is a shopkeeper or not
    const shopKeeper = await User.findById(userId);
    if (!shopKeeper) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Please login to continue" });
    }
    req.shopKeeper = shopKeeper;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized " + err.message });
  }
};

module.exports = auth;
