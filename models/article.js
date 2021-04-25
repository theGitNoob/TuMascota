const mongoose = require("mongoose");
let fs = require("fs/promises");

let articleSchema = mongoose.Schema({
  articleType: { type: String, required: true },
  type: { type: String, required: true },
  breed: { type: String },
  sex: String,
  price: { type: Number, required: true },
  cnt: { type: Number, default: 1, min: 0 },
  birthDay: Date,
  description: String,
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
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  imgExtension: String,
  available: { type: Boolean, default: true },
  stagedCnt: { type: Number, deafult: true },
});

articleSchema.post("findOneAndDelete", function (doc) {
  fs.unlink(`./public/img/articulos/${doc._id}.${doc.imgExtension}`).catch(
    (err) => {
      if (err && err.code != "ENOENT") console.error(err);
    }
  );
});

let articleModel = new mongoose.model("Pet", articleSchema);

module.exports.petModel = articleModel;
