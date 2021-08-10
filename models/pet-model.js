const { Schema, model } = require("mongoose");
let fs = require("fs/promises");

const imageSchema = new Schema({
  url: { type: String, required: true },
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

petSchema.post("findOneAndDelete", function (doc) {
  fs.unlink(`./public/img/mascotas/${doc._id}.${doc.imgExtension}`).catch(
    (err) => {}
  );
});

petSchema.post("remove", function (doc) {
  fs.unlink(`./public/img/mascotas/${doc._id}.${doc.imgExtension}`).catch(
    (err) => {}
  );
});

let petModel = new model("Pet", petSchema);

module.exports = petModel;