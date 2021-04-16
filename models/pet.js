const mongoose = require("mongoose");

let petSchema = new mongoose.Schema({
  type: { type: String, required: true },
  age: { type: Number, max: [100, "La edad es demasiado grande"] },
  price: { type: Number, required: true },
  breed: { type: String },
  ownerName: { type: String, require: true },
  ownerPhone: { type: Number, required: true },
  ownerAccount: {
    type: String,
    validate: {
      validator: function (account) {
        if (account === "") return true;
        for (const i of account) {
          if (i < "0" || i > "9") return false;
        }
        return account.length == 16;
      },
      message: "La cuenta es invalida",
    },
  },
  imgExtension: String,
});

let petModel = new mongoose.model("pet", petSchema);

module.exports.petModel = petModel;
