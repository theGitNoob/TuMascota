const mongoose = require("mongoose");
let fs = require("fs/promises");

let petSchema = mongoose.Schema({
  type: { type: String, required: true },
  breed: { type: String },
  sex: String,
  price: { type: Number, required: true },
  cnt: { type: Number, default: 1, min: 0 },
  birthDay: String,
  description: String,
  ownerName: { type: String, required: true },
  ownerPhone: { type: Number, required: true },
  ownerAccount: {
    type: String,
    validate: {
      validator: function (account) {
        for (const i of account) {
        }
        return account.length == 16;
      },
      message: "La cuenta es invalida",
    },
  },
  imgExtension: String,
  available: { type: Boolean, default: true },
  stagedCnt: { type: Number, default: 0 },
  added: { type: Number },
});

petSchema.post("findOneAndDelete", function (doc) {
  fs.unlink(
    `./public/img/mascotas/${doc._id}.${doc.imgExtension}`
  ).catch((err) => {});
});

petSchema.post("remove", function (doc) {
  fs.unlink(
    `./public/img/mascotas/${doc._id}.${doc.imgExtension}`
  ).catch((err) => {});
});

let petModel = new mongoose.model("Pet", petSchema);

module.exports.petModel = petModel;
