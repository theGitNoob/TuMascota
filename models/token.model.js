const { model, Schema } = require("mongoose");

const tokenSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, unique: true },
  token: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 10800,
  },
});

module.exports = model("Token", tokenSchema);
