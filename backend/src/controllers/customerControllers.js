const customerModel = require("../models/customerModel");
const recordModel = require("../models/recordModel");
const transactionModel = require("../models/transactionModel");
const userModel = require("../models/userModel");

const fetchUser = async (req, res) => {
  const { myId, userId } = req.user;
  try {
    const user = await userModel.findById(myId, { password: 0 }).populate({
      path: "customers",
      options: { sort: { date: -1 } },
    });
    const lastTransact = await Promise.all(
      user.customers.map(async (customerId) => {
        return await recordModel.findOne({ $or: [{userId, customerId},{userId:customerId, customerId:userId}] });
      })
    );
    res.status(200).json(user,lastTransact);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error !" });
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
      const user = await userModel.findByIdAndUpdate(myId, {
        $push: { customers: customer.userId },
      });
    } else {
      customer = await customerModel.create({
        name,
        phone,
      });
      await userModel.findByIdAndUpdate(myId, {
        $push: { customers: customer._id },
      });
    }
    res.status(201).json({ message: "Customer added successfully !" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong !" });
  }
};

module.exports = { addCustomer, fetchUser };
