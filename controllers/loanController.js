const { validateLoanCreationDetails } = require("../utils/validations");
const Customer = require("../models/customerModel");
const Loan = require("../models/loanModel");
const moment = require("moment");
const { currencyType } = require("../utils/constants");
const issue = moment();
// Create Loan
const createLoan = async (req, res) => {
  try {
    const { customerId, frequency, itemDescription, loanAmount } = req.body;
    // Validate the incoming data
    validateLoanCreationDetails(req.body);
    // check whether customer exists or not
    const existingCustomer = await Customer.findOne({ _id: customerId });
    if (!existingCustomer) {
      return res.status(404).json({ message: "Customer Not Found" });
    }
    // If there is already a loan associated with the customer
    const existingLoan = await Loan.findOne({
      customerId: existingCustomer._id,
    });
    if (existingLoan) {
      // Check whether the loan Amount is less than credit limit of customer
      if (loanAmount > existingCustomer.creditLimit) {
        return res.status(400).json({
          message: `Total Loan Amount:${
            loanAmount + existingLoan.loanAmount
          } ${currencyType} is greater than Credit Limit:${
            existingCustomer.creditLimit
          } ${currencyType}`,
        });
      }
      // Add loan Amount to exisiting loan amount
      existingLoan.loanAmount += loanAmount;
      await existingLoan.save();
      existingCustomer.creditLimit -= loanAmount;
      await existingCustomer.save();
      return res.status(201).json({
        message: `Loan Created Successfully for ${existingCustomer.name}`,
      });
    }
    // Check whether the loan Amount is less than credit limit of customer
    if (loanAmount > existingCustomer.creditLimit) {
      return res.status(400).json({
        message: `${existingCustomer.name} is having loan:${loanAmount} ${currencyType} greater than Credit Limit:${existingCustomer.creditLimit} ${currencyType}`,
      });
    }
    // Create a New Loan
    const loan = {
      customerId,
      itemDescription,
      issueDate: issue.toDate(),
      dueDate:
        frequency === "weekly"
          ? issue.clone(1, "weeks").toDate()
          : issue.clone(1, "months").toDate(),
      loanAmount,
      frequency,
    };
    const newLoan = new Loan(loan);
    // Save the Loan in DB
    await newLoan.save();
    existingCustomer.creditLimit -= loanAmount;
    await existingCustomer.save();
    return res.status(201).json({
      message: `Loan Created Successfully for ${existingCustomer.name}`,
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// Get All Active loans (status:pending)
const getLoans = async (req, res) => {
  try {
    const { status } = req.query;
    const { shopKeeper } = req;
    const shopkeeperId = shopKeeper._id;
    // Customers of Shopkeeper
    const customers = await Customer.find({ userId: shopkeeperId });
    // Get All Customer Ids
    const customerIds = customers.map((customer) => customer._id);
    // Get Loans of Customers
    const loans = await Loan.find({ customerId: { $in: customerIds } })
      .find({ status: status || "pending" })
      .populate("customerId", "name email phone")
      .select("loanAmount  issueDate dueDate frequency status");

    // const activeLoans = await Loan.find({ status: "pending" });
    return res.json({ data: loans });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

module.exports = { createLoan, getLoans };
