let { model, Schema } = require("mongoose");
let fs = require("fs/promises");

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

accesoriesSchema.post("findOneAndDelete", function (doc) {
  fs.unlink(`./public/img/accesorios/${doc._id}.${doc.imgExtension}`).catch(
    (err) => {
      if (err && err.code != "ENOENT") console.error(err);
    }
  );
});

accesoriesSchema.post("remove", function (doc) {
  fs.unlink(`./public/img/accesorios/${doc._id}.${doc.imgExtension}`).catch(
    (err) => {
      if (err && err.code != "ENOENT") console.error(err);
    }
  );
});

module.exports = new model("Accesorie", accesoriesSchema);
