const mongoose = require("mongoose");
const validator = require("validator")
const loanSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    phone: {
      type: String,
      required: [true, "Phone Number is required"],
      trim: true,
      validate: {
        validator: function (value) {
          return value.length === 10 && validator.isMobilePhone(value, "en-IN");
        },
        message: "Invalid Phone Number",
      },
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
    remainingAmount: {
      type: Number,
      required: [true, "Remaining Amount is required"],
      min: [0, "Remaining Amount cannot be negative"],
      validate: function (value) {
        if (value > this.loanAmount) {
          throw new Error(
            "Remaining Amount cannot be greater than Loan Amount"
          );
        }
      },

      default: function () {
        return this.loanAmount;
      },
    },
    issueDate: {
      type: Date,
      required: [true, "Issue Date is required"],
    },
    dueDate: {
      type: Date,
      required: [true, "Due Date is required"],
      validate: function (value) {
        if (value < this.issueDate) {
          throw new Error("Due Date must be greater than Issue Date");
        }
      },
    },
    frequency: {
      type: String,
      enum: {
        values: ["weekly", "monthly"],
        message: "Frequency must be weekly or monthly",
      },
      required: [true, "Frequency is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "paid", "overdue"],
        message: "Status must be pending, paid or overdue",
      },
      default: "pending",
      trim: true,
    },
  },
  { timestamps: true }
);

const Loan = mongoose.model("Loan", loanSchema) || mongoose.models.Loan;
module.exports = Loan;
