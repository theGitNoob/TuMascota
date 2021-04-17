let mongoose = require("mongoose");
let fs = require("fs/promises");

let accesoriesSchema = new mongoose.Schema({
  type: { type: String, required: true },
  price: { type: Number, required: true },
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
  imgExtension: String,
});

// accesoriesSchema.virtual("prevImgExtension").get(fuc)

accesoriesSchema.post("findOneAndDelete", function (doc) {
  fs.unlink(`./public/img/accesorios/${doc._id}.${doc.imgExtension}`).catch(
    (err) => {
      if (err && err.code != "ENOENT") console.error(err);
    }
  );
});

let accesoriesModel = new mongoose.model("accesorie", accesoriesSchema);

module.exports.accesoriesModel = accesoriesModel;
