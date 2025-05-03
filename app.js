const express = require("express");
require("dotenv").config();
const initializeDB = require("./config/database");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/userRouter");
const customerRouter = require("./routes/customerRouter");
const loanRouter = require("./routes/loanRouter");

const app = express();

const PORT = 5000;

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/user", userRouter);
app.use("/customer", customerRouter);
app.use("/loan", loanRouter);

// Default Route
app.get("/", (req, res) => {
  res.send("Welcome to Credikhaata, where you can manage your customers,loans,track repayments and much more.");
});


// Initialize DB and Server
const initializeDBAndServer = async () => {
  try {
    await initializeDB();
    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};
initializeDBAndServer();
