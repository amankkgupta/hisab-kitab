const customerModel = require("../models/customerModel");
const transactionModel = require("../models/transactionModel");
const userModel = require("../models/userModel");

const fetchAllCustomers = async (req, res) => {
  const { myId } = req.user;
  try {
    const user = await userModel.findById(myId, { password: 0 }).populate({
      path: "customers",
      options: { sort: { date: -1 } },
      populate: {
        path: "lastTransact",
      },
    });
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Server error !" });
  }
};

const addCustomer = async (req, res) => {
  const { name, phone } = req.body;
  const { userId, myId } = req.user;
  try {
    let customer;
    if (phone) {
      customer = await userModel.findOne(
        { phone },
        { userId: 1, customers: 1 }
      );
    }
    if (customer) {
      customer.customers.push(userId);
      await customer.save();
      const user = await userModel.findByIdAndUpdate(
         myId,
        {
          $push: { customers: customer.userId },
        }
      );
    } else {
      customer = await customerModel.create({
        name,
        phone,
      });
      await userModel.findByIdAndUpdate(
        myId,
        {
          $push: { customers: customer._id },
        }
      );
    }
    res.status(201).json({ message: "Customer added successfully !" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Something went wrong !" });
  }
};

module.exports = { addCustomer, fetchAllCustomers };
