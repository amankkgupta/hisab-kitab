const customerModel = require("../models/customerModel");
const transactionModel = require("../models/transactionModel");

const addTransact = async (req, res) => {
  const {userId, myId}= req.user;
  const { customerId, amount, note } = req.body;
  if (!amount)
    return res.status(400).json({ message: "Please Enter Amount !" });
  try {
    const customer = await customerModel.findById(customerId, {
      lastTransact: 1,
      totalAmount: 1,
    });
    let totalAmount = Number(amount) + Number(customer.totalAmount);
    const trans = await transactionModel.create({
      userId,
      customerId,
      amount,
      totalAmount,
      note,
    });
    customer.lastTransact = trans._id;
    customer.totalAmount = totalAmount;
    await customer.save();
    res.status(201).json({ message: "Transaction successful!" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Server error" });
  }
};

const fetchAllTransact = async (req, res) => {
  const { userId } = req.user;
  const { customerId } = req.body;
  try {
    const trans = await transactionModel.find({ customerId, userId });
    res.status(200).json({ trans });
  } catch (err) {
    res.status(400).json({ message: "Server error !" });
  }
};

const editTransact = async (req, res) => {
  const { userId } = req.user;
  const { transactId, note, isDeleted } = req.body;
  try {
    if (isDeleted) {
      const trans = await transactionModel.findOneAndUpdate(
        { _id: transactId },
        { isDeleted },
        { new: true }
      );
      console.log(trans.amount);
      await customerModel.updateOne(
        { _id: trans.customerId },
        { $inc: { totalAmount: -trans.amount } }
      );
      res.status(200).json({ message: "Deleted Successfully !" });
    } else {
      const trans = await transactionModel.updateOne(
        { _id: transactId },
        { note },
        { new: true }
      );
      res.status(200).json({ message: "Edited Successfully !" });
    }
  } catch (err) {
    res.status(400).json({ message: "Server error !" });
  }
};

module.exports = { addTransact, fetchAllTransact, editTransact };
