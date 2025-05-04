const Loan = require("../models/loanModel");
const Repayment = require("../models/repaymentModel");
const { validateLoanRepaymentDetails } = require("../utils/validations");
const { currencyType } = require("../utils/constants");
const Customer = require("../models/customerModel");
const moment = require("moment");
const loanRepayment = async (req, res) => {
  try {
    const { loanId } = req.params;
    const { shopKeeper } = req;
    const shopkeeperId = shopKeeper._id;
    const { repaymentAmount, repaymentDate } = req.body;

    const existingLoan = await Loan.findById(loanId);
    if (!existingLoan) {
      return res
        .status(404)
        .json({ message: `No Loan with this ${loanId} Found` });
    }
    // validate the Incoming Data
    validateLoanRepaymentDetails(req.body);
    // Update the remaning Amount to be paid by customer

    // Check repayment amount should be less than or equal to remaining amount
    if (repaymentAmount > existingLoan.remainingAmount) {
      return res.status(400).json({
        message: `Repayment Amount: ${repaymentAmount} ${currencyType} should be less than or equal to ${existingLoan.remainingAmount} ${currencyType}`,
      });
    }
    existingLoan.remainingAmount =
      existingLoan.remainingAmount - repaymentAmount;

    // Update the status of loan
    if (existingLoan.remainingAmount === 0) {
      existingLoan.status = "paid";
      // Increase the credit limit of customer
      const customer = await Customer.findById(existingLoan.customerId);
      if (!customer) {
        return res.status(404).json({ message: "Customer Not Found" });
      }
      customer.creditLimit += existingLoan.loanAmount;
      await customer.save();
    }
    await existingLoan.save();

    // Create a New Repayment Record for Loan
    const repaymentRecord = new Repayment({
      loanId,
      shopKeeperId: shopkeeperId,
      repaymentAmount,
      repaymentDate: repaymentDate || new Date(),
      isPartiallyPaid: existingLoan.remainingAmount === 0 ? false : true,
    });
    // Save the record in DB
    const savedRepaymentRecord = await repaymentRecord.save();
    const { __v, updatedAt, createdAt, ...filteredRepayment } =
      savedRepaymentRecord.toObject();
    res.status(201).json({
      message: "Repayment Done Successfully",
      data: {
        createdAt: moment(createdAt).format("DD-MM-YYYY"),
        ...filteredRepayment,
        loanAmount: existingLoan.loanAmount,
        remainingAmount: existingLoan.remainingAmount,
      },
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// Get all Loan Repayments related to Shopkeeper(loggedIn User)

const getLoanRepayments = async (req, res) => {
  try {
    const { shopKeeper } = req;
    const shopkeeperId = shopKeeper._id;
    const repayments = await Repayment.find({ shopKeeperId: shopkeeperId })
      .populate("loanId", "loanAmount issueDate dueDate")
      .select("_id loanId repaymentAmount repaymentDate isPartiallyPaid")
      .lean();
    const formattedRepayments = repayments.map((eachRepayment) => ({
      ...eachRepayment,
      repaymentDate: moment(eachRepayment.repaymentDate).format("DD-MM-YYYY"),
    }));
    return res.json({ data: formattedRepayments });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

module.exports = { loanRepayment, getLoanRepayments };
