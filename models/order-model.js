const { Schema, model } = require("mongoose");

const orderSchema = Schema({
  type: { type: String, required: true },
  pet: { type: Schema.Types.ObjectId, ref: "Pet" },
  accesorie: { type: Schema.Types.ObjectId, ref: "Accesorie" },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  cnt: { type: Number, required: true },
  price: { type: Number, required: true },
  state: {
    type: String,
    enum: ["pendient", "aproved", "onway", "completed", "canceled"],
    default: "pendient",
  },
  date: { type: Date, default: Date.now },
});

orderSchema.virtual("fullDate").get(function () {
  return `${this.date.getDate()}/${this.date.getMonth() + 1}/${this.date.getFullYear()}`;
});

module.exports = new model("Order", orderSchema);
