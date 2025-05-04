const mongoose = require("mongoose");
const repaymentSchema = new mongoose.Schema(
  {
    loanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Loan",
      required: [true, "Loan Id is required"],
    },
    shopKeeperId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "ShopKeeper Id is required"],
    },
    repaymentAmount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    repaymentDate: {
      type: Date,
      required: [true, "Repayment Date is required"],
      default: Date.now(),
    },
    isPartiallyPaid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
repaymentSchema.index({ loanId: 1, repaymentDate: 1 });

const Repayment =
  mongoose.model("Repayment", repaymentSchema) || mongoose.models.Repayment;

module.exports = Repayment;
