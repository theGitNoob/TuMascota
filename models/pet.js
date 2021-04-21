const mongoose = require("mongoose");
let fs = require("fs/promises");

let petSchema = mongoose.Schema({
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
  cnt: { type: Number, default: 1 },
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  imgExtension: String,
  status: { type: Boolean, default: true },
});

petSchema.post("findOneAndDelete", function (doc) {
  fs.unlink(`./public/img/mascotas/${doc._id}.${doc.imgExtension}`).catch(
    (err) => {
      if (err && err.code != "ENOENT") console.error(err);
    }
  );
});

let petModel = new mongoose.model("Pet", petSchema);

module.exports.petModel = petModel;
