const customerModel = require("../models/customerModel");
const recordModel = require("../models/recordModel");
const transactionModel = require("../models/transactionModel");

const addTransact = async (req, res) => {
  const { userId } = req.user;
  const { customerId, amount, note } = req.body;
  console.log(amount);
  if (!amount)
    return res.status(400).json({ message: "Please Enter Amount !" });
  try {
    const record = await recordModel.findOne({
      $or: [
        { userId, customerId },
        { userId: customerId, customerId: userId },
      ],
    });
    let totalAmount = Number(amount) + Number(record.totalAmount);
    const trans = await transactionModel.create({
      userId,
      customerId,
      amount,
      totalAmount,
      note,
    });
    record.lastTransact = trans._id;
    record.totalAmount = totalAmount;
    await record.save();
    res.status(201).json({ message: "Transaction successful!" });
  } catch (err) {
    // console.log(err);
    res.status(400).json({ message: "Server error" });
  }
};

const fetchAllTransact = async (req, res) => {
  const { userId } = req.user;
  const { customerId } = req.body;
  try {
    const trans = await transactionModel.find({
      $or: [
        { userId, customerId },
        { userId: customerId, customerId: userId },
      ],
    });
    const record = await recordModel.findOne({
      $or: [
        { userId, customerId },
        { userId: customerId, customerId: userId },
      ],
    });
    res.status(200).json({ trans, record });
  } catch (err) {
    res.status(400).json({ message: "Server error !" });
  }
};

const editTransact = async (req, res) => {
  const { userId } = req.user;
  const { transactId, note, isDeleted } = req.body;
  const trans = await transactionModel.findOne({ _id: transactId });
  if (userId != trans.userId)
    return res.status(403).json({ message: "Not Autherized !" });
  try {
    if (isDeleted) {
      if (trans.isDeleted) {
        return res.status(401).json({ message: "Already deleted !" });
      }
      trans.isDeleted = true;
      await trans.save();
      await recordModel.updateOne(
        {
          $or: [
            { userId, customerId: trans.customerId },
            { userId: trans.customerId, customerId: userId },
          ],
        },
        { $inc: { totalAmount: -trans.amount } }
      );
      res.status(200).json({ message: "Deleted Successfully !" });
    } else {
      trans.note = note;
      await trans.save();
      res.status(200).json({ message: "Edited Successfully !" });
    }
  } catch (err) {
    res.status(400).json({ message: "Server error !" });
  }
};

module.exports = { addTransact, fetchAllTransact, editTransact };
