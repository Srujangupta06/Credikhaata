const mongoose = require("mongoose");
const validator = require("validator");

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
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
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    trustScore: {
      type: Number,
      required: [true, "Trust Score is required"],
      min: [1, "Trust Score must be at least 1"],
      max: [10, "Trust Score cannot exceed 10"],
    },
    creditLimit: {
      type: Number,
      default: 0,
      min: [0, "Credit Limit cannot be negative"],
      max: [10000, "Credit Limit cannot exceed 10000"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User Id is required"],
    },
  },
  { timestamps: true }
);

const Customer =
  mongoose.model("Customer", customerSchema) || mongoose.models.Customer;
module.exports = Customer;
