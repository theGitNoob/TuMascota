let mongoose = require("mongoose");

let orderSchema = mongoose.Schema({
  articleId: { type: mongoose.Schema.Types.ObjectId, require: true },
  articleType: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  cnt: { type: Number, required: true },
  price: { type: Number, required: true },
});
let orderModel = new mongoose.model("Order", orderSchema);

module.exports.orderModel = orderModel;
