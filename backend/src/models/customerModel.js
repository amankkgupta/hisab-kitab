const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: Number, default: null },
  isSupplier:{type: Boolean, default:false},
  totalAmount: { type: Number, default: 0 },
  lastTransact: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transaction",
    default: null,
  },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Customer", customerSchema);
