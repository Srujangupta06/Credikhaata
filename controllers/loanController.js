const { validateLoanCreationDetails } = require("../utils/validations");
const Customer = require("../models/customerModel");
const Loan = require("../models/loanModel");
const Repayment = require("../models/repaymentModel");
const moment = require("moment");
const { currencyType } = require("../utils/constants");
const issue = moment();
// Create Loan
const createLoan = async (req, res) => {
  try {
    const { shopKeeper } = req;
    const { customerId, frequency, itemDescription, loanAmount } = req.body;
    // Validate the incoming data
    validateLoanCreationDetails(req.body);
    // check whether customer exists or not
    const existingCustomer = await Customer.findOne({
      $and: [{ _id: customerId }, { userId: shopKeeper._id }],
    });
    if (!existingCustomer) {
      return res.status(404).json({ message: "Customer Not Found" });
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
    // Status can be pending, paid, overdue
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

// Get Loans of Specific Customer of all status (pending,paid,overdue)

const getLoanOfCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { status } = req.query;
    const { shopKeeper } = req;
    const shopkeeperId = shopKeeper._id;

    // Find Customer of Logged In Shopkeeper
    const customer = await Customer.findOne({
      $and: [{ _id: customerId }, { userId: shopkeeperId }],
    });
    if (!customer) {
      return res.status(404).json({ message: "Customer Not Found" });
    }
    // If Customer exists check for loans of customer
    const loans = await Loan.find({ customerId })
      .find({ status: status || "pending" })
      .populate("customerId", "name phone")
      .select(
        "customerId loanAmount remainingAmount issueDate dueDate status frequency"
      )
      .lean();

    const formattedLoans = loans.map((eachLoan) => ({
      ...eachLoan,
      issueDate: moment(eachLoan.issueDate).format("DD-MM-YYYY"),
      dueDate: moment(eachLoan.dueDate).format("DD-MM-YYYY"),
    }));
    return res.json({ data: formattedLoans });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// Get Summary of All Loans that Shopkeeper has (pending,paid,overdue)

const getSummaryOfLoans = async (req, res) => {
  try {
    const { shopKeeper } = req;
    const shopkeeperId = shopKeeper._id;

    // Get all customers of the shopkeeper

    const customers = await Customer.find({ userId: shopkeeperId }).select(
      "_id"
    );
    const customerIds = customers.map((eachCustomer) => eachCustomer._id);

    // Get all loans issued by this shopkeeper for above customers
    const loans = await Loan.find({ customerId: { $in: customerIds } });

    const loanIds = loans.map((eachLoan) => eachLoan._id);

    // Get all repayments for above loans
    const repayments = await Repayment.find({ loanId: { $in: loanIds } });

    // Calculate Total Loan Amount issued by ShopKeeper for his customers
    const totalLoanAmount = loans.reduce(
      (acc, eachLoan) => acc + eachLoan.loanAmount,
      0
    );

    // Calculate total Repayments received by ShopKeeper from his customers
    const totalRepaymentAmount = repayments.reduce(
      (acc, eachRepayment) => acc + eachRepayment.repaymentAmount,
      0
    );

    // Overdue Amount
    const now = moment();
    const overdueAmount = loans.reduce((sum, loan) => {
      const isOverdue =
        loan.status !== "paid" && moment(loan.dueDate).isBefore(now);
      return isOverdue ? sum + loan.remainingAmount : sum;
    }, 0);

    // Calculate the Average Repayments for ShopKeeper
    const fullyPaidLoans = loans.filter(
      (eachLoan) => eachLoan.status === "paid"
    );

    let totalDays = 0;
    let count = 0;
    for (const loan of fullyPaidLoans) {
      const fullRepaymentLoan = await Repayment.find({
        loanId: loan._id,
        isPartiallyPaid: false,
      }).sort({ repaymentDate: -1 });
      if (fullRepaymentLoan.length > 0) {
        const lastRepaymentDate = moment(fullRepaymentLoan[0].repaymentDate);
        const issuedDate = moment(loan.issueDate);
        const days = lastRepaymentDate.diff(issuedDate, "days");
        totalDays += days;
        count++;
      }
    }

    const averageRepayments = count > 0 ? totalDays / count : 0;

    return res.json({
      totalLoanAmount,
      totalRepaymentAmount,
      overdueAmount,
      averageRepayments,
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

module.exports = { createLoan, getLoans, getLoanOfCustomer, getSummaryOfLoans };
