const mongoose = require("mongoose");

const initializeDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URL
    );
    console.log("DB Connection: Success");
  } catch (err) {
    console.log(err);
  }
};
module.exports = initializeDB;
