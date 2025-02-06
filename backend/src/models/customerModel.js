const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: Number, default: null },
  // isSupplier:{type: Boolean, default:false},
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Customer", customerSchema);
