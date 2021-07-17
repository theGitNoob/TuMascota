let mongoose = require("mongoose");
let fs = require("fs/promises");

let AccesoriesSchema = mongoose.Schema({
  type: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  ownerName: { type: String, required: true },
  ownerPhone: { type: Number, required: true },
  cnt: { type: Number, default: 1 },
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
  added: { type: Number },
});

// AccesoriesSchema.virtual("prevImgExtension").get(fuc)

AccesoriesSchema.post("findOneAndDelete", function (doc) {
  fs.unlink(`./public/img/accesorios/${doc._id}.${doc.imgExtension}`).catch(
    (err) => {
      if (err && err.code != "ENOENT") console.error(err);
    }
  );
});

AccesoriesSchema.post("remove", function (doc) {
  fs.unlink(`./public/img/accesorios/${doc._id}.${doc.imgExtension}`).catch(
    (err) => {
      if (err && err.code != "ENOENT") console.error(err);
    }
  );
});

let accesoriesModel = new mongoose.model("Accesorie", AccesoriesSchema);

module.exports.accesoriesModel = accesoriesModel;
