const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  itemDescription: {
    type: String,
    required: [true, "Item Description is required"],
    trim: true,
    minLength: [6, "Item Description must be at least 6 characters long"],
  },
  loanAmount: {
    type: Number,
    required: [true, "Loan Amount is required"],
    min: [100, "Loan Amount must be at least 100"],
  },
  issueDate: {
    type: Date,
    required: [true, "Issue Date is required"],
  },
  dueDate: {
    type: Date,
    required: [true, "Due Date is required"],
  },
  frequency: {
    type: String,
    enum: ["weekly", "monthly"],
    required: [true, "Frequency is required"],
    trim: true,
  },
});

const Loan = mongoose.model("Loan", loanSchema) || mongoose.models.Loan;
module.exports = Loan;
