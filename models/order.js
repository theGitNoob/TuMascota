let mongoose = require("mongoose");

let orderSchema = mongoose.Schema({
  userName: { type: String, required: true },
  userPhone: { type: String, required: true },
  articleId: mongoose.Schema.Types.ObjectId,
  articleType: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});
let orderModel = new mongoose.model("Order", orderSchema);

module.exports.orderModel = orderModel;
