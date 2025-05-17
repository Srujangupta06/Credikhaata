const Customer = require("../models/customerModel");
const User = require("../models/userModel");
const {
  validateCustomerDetails,
} = require("../utils/validations");

// Create Customer
const createCustomer = async (req, res) => {
  try {
    const { shopKeeper } = req;
    const shopkeeperId = shopKeeper._id;
    let { name, phone, address, trustScore,creditLimit } = req.body;
    // Validate the incoming data
    validateCustomerDetails(req.body);
    //Check the User exist with user Id
    const isExistingShopkeeper = await User.findById(shopkeeperId);
    if (!isExistingShopkeeper) {
      return res.status(400).json({ message: "Shopkeeper doesn't exist" });
    }
    // Check the Customer exists before or not
    const isExistingCustomer = await Customer.findOne({ phone, userId: shopkeeperId });
    if (isExistingCustomer) {
      return res.status(409).json({ message: "Customer Already Exists With Same Phone Number" });
    }
    // Create a New Customer

    if(!creditLimit){
      creditLimit = 0;
    }
    const newCustomer = new Customer({
      name,
      phone,
      address,
      trustScore,
      creditLimit,
      userId: shopkeeperId,
    });
    // Save the Customer in DB
    await newCustomer.save();
    return res.status(201).json({ data: newCustomer, message: "Customer Created Successfully" });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// To get all Customers related to Shopkeeper(loggedIn User)
const getCustomers = async (req, res) => {
  try {
    const { shopKeeper } = req;
    const shopkeeperId = shopKeeper._id;
    const customers = await Customer.find({ userId: shopkeeperId }).select("-userId -__v  -updatedAt");
    return res.json({ data: customers });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// To get Single Customer Info
const getCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const {shopKeeper} = req;
    const customer = await Customer.findOne({_id:customerId}).select("-updatedAt -__v");

    if (!customer) {
      return res.status(404).json({ message: "Customer Not Found" });
    }
     // If customer exists and check whether it belongs to shopkeeper or not
    if (customer.userId.toString() !== shopKeeper._id.toString()) {
      return res.status(404).json({ message: "Customer Not Found in your Shop" });
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
      return res.status(404).json({ message: "Customer Not Found" });
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
      return res.status(404).json({ message: "Customer Not Found" });
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
