const validator = require("validator");
const options = {
  minLength: 6,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
  returnScore: false,
};
const validateSignUpDetails = (userInfo) => {
  let { name, email, phone, password } = userInfo;

  // Remove extra spaces
  name = name?.trim();
  email = email?.trim();
  phone = phone?.trim();
  password = password?.trim();

  if (!name || !email || !phone || !password) {
    throw new Error("All fields are required");
  }
  if (!validator.isEmail(email)) {
    throw new Error("Invalid email");
  }
  if (phone.length !== 10 || !validator.isMobilePhone(phone, "en-IN")) {
    throw new Error("Invalid Phone Number");
  }
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }
  if (!validator.isStrongPassword(password, options)) {
    throw new Error(
      "Password must have at least one lowercase letter, one uppercase letter, one number and one special character"
    );
  }
};

const validateLoginDetails = (userInfo) => {
  const { email, password } = userInfo;
  if (!email || !password) {
    throw new Error("All fields are required");
  }
  if (!validator.isEmail(email)) {
    throw new Error("Invalid email");
  }
};

const validateCustomerDetails = (customerInfo) => {
  const { name, phone, address, trustScore } = customerInfo;
  if (!name || !phone || !address || !trustScore) {
    throw new Error("All fields are required");
  }
  if (phone.length !== 10 || !validator.isMobilePhone(phone, "en-IN")) {
    throw new Error("Invalid Phone Number");
  }
  if (typeof trustScore !== "number") {
    throw new Error("Trust Score must be a number");
  }
  if (trustScore < 1 || trustScore > 10) {
    throw new Error("Trust Score must be between 1 and 10");
  }
};

// const validateCustomerUpdateInfo = (req) => {
//   const { address, creditLimit, trustScore } = req.body;
//   // Check the incoming data related to given field user can update any field or not, So we need to check specific field
//   if (trustScore !== undefined) {
//     if (typeof trustScore !== "number") {
//       throw new Error("Trust Score must be a number");
//     }
//     if (trustScore < 1 || trustScore > 10) {
//       throw new Error("Trust Score must be between 1 and 10");
//     }
//   }

//   if (creditLimit !== undefined) {
//     if (typeof creditLimit !== "number") {
//       throw new Error("Credit Limit must be a number");
//     }
//     if (creditLimit < 0 || creditLimit > 10000) {
//       throw new Error("Credit Limit must be between 0 and 10000");
//     }
//   }

//   if (address !== undefined) {
//     if (typeof address !== "string" || address.trim() === "") {
//       throw new Error("Address must be a non-empty string");
//     }
//   }
// };

const validateLoanCreationDetails = (loanInfo) => {
  const { loanAmount, customerId, itemDescription, frequency } = loanInfo;
  if (!loanAmount || !itemDescription || !customerId || !frequency) {
    throw new Error("All fields are required");
  }
  if (typeof loanAmount !== "number") {
    throw new Error("Loan Amount must be a number");
  }
  if (loanAmount < 100) {
    throw new Error("Loan Amount must be at least 100");
  }
  if (typeof frequency !== "string" || frequency.trim() === "") {
    throw new Error("Frequency must be a non-empty string");
  }
  if (frequency !== "weekly" && frequency !== "monthly") {
    throw new Error("Frequency must be weekly or monthly");
  }
};

const validateLoanRepaymentDetails = (loanInfo) => {
  const { repaymentAmount, repaymentDate } = loanInfo;
  if (repaymentAmount === undefined || repaymentAmount === null) {
    throw new Error("Repayment Amount is required");
  }
  if (typeof repaymentAmount !== "number") {
    throw new Error("Repayment Amount must be a number");
  }
  if (repaymentAmount < 0) {
    throw new Error("Repayment Amount cannot be negative");
  }
  if (repaymentDate) {
    if (typeof repaymentDate !== "string" || repaymentDate.trim() === "") {
      throw new Error("Repayment Date must be a non-empty string");
    }
  }
};

module.exports = {
  validateSignUpDetails,
  validateLoginDetails,
  validateCustomerDetails,
  validateLoanCreationDetails,
  validateLoanRepaymentDetails,
};
