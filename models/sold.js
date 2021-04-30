let mongoose = require("mongoose");

let soldSchema = mongoose.Schema({
  articleType: { type: String, required: true },
  cnt: { type: Number, required: true },
  date: { type: Date, required: true },
  articleValue: { type: Number, required: true },
  totalValue: { type: Number, required: true },
});

let soldModel = new mongoose.model("Sold", soldSchema);
module.exports.soldModel = soldModel;
