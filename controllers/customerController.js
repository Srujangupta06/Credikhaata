const Customer = require("../models/customerModel");
const User = require("../models/userModel");
const {
  validateCustomerDetails,
  validateCustomerUpdateInfo,
} = require("../utils/validations");

// Create Customer
const createCustomer = async (req, res) => {
  try {
    const { shopKeeper } = req;
    const shopkeeperId = shopKeeper._id;
    const { name, phone, address, trustScore } = req.body;
    // Validate the incoming data
    validateCustomerDetails(req.body);
    //Check the User exist with user Id
    const isExistingShopkeeper = await User.findById(shopkeeperId);
    if (!isExistingShopkeeper) {
      return res.status(400).json({ message: "Shopkeeper doesn't exist" });
    }
    // Check the Customer exists before or not
    const isExistingCustomer = await Customer.findOne({ phone });
    if (isExistingCustomer) {
      return res.status(400).json({ message: "Customer already exists" });
    }
    // Create a New Customer

    const newCustomer = new Customer({
      name,
      phone,
      address,
      trustScore,
      userId: shopkeeperId,
    });
    // Save the Customer in DB
    await newCustomer.save();
    return res.json({ message: "Customer Created Successfully" });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// To get all Customers related to Shopkeeper(loggedIn User)
const getCustomers = async (req, res) => {
  try {
    const { shopKeeper } = req;
    const shopkeeperId = shopKeeper._id;
    const customers = await Customer.find({ userId: shopkeeperId });
    return res.json({ data: customers });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// To get Single Customer Info

const getCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(400).json({ message: "Customer Not Found" });
    }
    // If customer exists and check whether it belongs to shopkeeper or not
    if (customer.userId != req.shopKeeper._id) {
      return res.status(400).json({ message: "Customer Not Found" });
    }
    return res.json({ data: customer });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// Update Customer
const updateCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    // User can able to edit only address,creditLimit,trustScore of PresentCustomer
    const ALLOWED_FIELDS = ["address", "creditLimit", "trustScore"];
    const isEditAllowed = Object.keys(req.body).every((field) =>
      ALLOWED_FIELDS.includes(field)
    );
    if (!isEditAllowed) {
      return res
        .status(400)
        .json({ message: "Only address,creditLimit,trustScore can be edited" });
    }
    // Check the Customer exists before or not
    const existingCustomer = await Customer.findById(customerId);
    if (!existingCustomer) {
      return res.status(400).json({ message: "Customer doesn't exist before" });
    }
    // Update the Custome in DB
    Object.keys(req.body).forEach((field) => {
      existingCustomer[field] = req.body[field];
    });
    await existingCustomer.save();
    return res.json({
      message: `The details for ${existingCustomer.name} have been successfully updated`,
      data: existingCustomer,
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// Remove Customer
const removeCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    // Check customer exists before or not
    const existingCustomer = await Customer.findById(customerId);
    if (!existingCustomer) {
      return res.status(400).json({ message: "Customer doesn't exist before" });
    }
    // If Exists remove the customer
    await Customer.findByIdAndDelete(customerId);
    return res.status(200).json({
      message: `${existingCustomer.name} has been successfully removed`,
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

module.exports = {
  createCustomer,
  updateCustomer,
  removeCustomer,
  getCustomers,
  getCustomer,
};
