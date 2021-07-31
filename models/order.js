let mongoose = require("mongoose");

let orderSchema = mongoose.Schema({
  articleId: { type: mongoose.Schema.Types.ObjectId, required: true },
  articleType: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  cnt: { type: Number, required: true },
  price: { type: Number, required: true },
  state: {
    type: String,
    enum: ["pendient", "aproved", "onway", "completed", "canceled"],
    default: "pendient",
  },
  date: { type: Date, default: Date.now },
  requestDate: { type: String },
});

orderSchema.virtual("fullDate").get(function () {
  return `${this.date.getDate()}/${this.date.getMonth() + 1}/${this.date.getFullYear()}`;
});

//["pendient","aproved","onway","completed","canceled"]
let orderModel = new mongoose.model("Order", orderSchema);

module.exports.orderModel = orderModel;
