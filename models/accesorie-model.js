let { model, Schema } = require("mongoose");
const { addImages } = require("../helpers/file-helper");

const imageSchema = new Schema({
  url: { type: String, required: true },
});

const accesoriesSchema = Schema({
  type: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  cnt: { type: Number, default: 1 },
  ownerName: { type: String, required: true },
  ownerPhone: { type: Number, required: true },
  ownerAccount: String,
  images: [imageSchema],
  status: { type: String, default: "available" },
  stagedCnt: { type: Number, deafult: true },
  added: { type: Date, default: Date.now },
});

accesoriesSchema.method("addImages", addImages);

module.exports = new model("Accesorie", accesoriesSchema);
