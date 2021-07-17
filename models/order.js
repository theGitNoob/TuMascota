let mongoose = require("mongoose");

let OrderSchema = mongoose.Schema({
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
  requestDate: { type: String },
});

//["pendient","aproved","onway","completed","canceled"]
let orderModel = new mongoose.model("Order", OrderSchema);

module.exports.orderModel = orderModel;
