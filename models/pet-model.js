const { Schema, model } = require("mongoose");
const { addImages, deleteImages } = require("../helpers/file-helper");

const imageSchema = new Schema({
  url: { type: String },
});

const petSchema = Schema({
  type: { type: String, required: true },
  breed: { type: String },
  sex: String,
  price: { type: Number, required: true },
  cnt: { type: Number, default: 1, min: 0, required: true },
  birthDay: String,
  description: String,
  ownerName: { type: String, required: true },
  ownerPhone: { type: Number, required: true },
  ownerAccount: String,
  images: [imageSchema],
  status: { type: String, default: "available" },
  stagedCnt: { type: Number, default: 0 },
  added: { type: Date, default: Date.now },
});

petSchema.method("addImages", addImages);
petSchema.method("deleteImages", deleteImages);

module.exports = new model("Pet", petSchema);
