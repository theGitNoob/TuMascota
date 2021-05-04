let mongoose = require("mongoose");
let validator = require("validator");
let parsePhone = require("../utils").parsePhone;

let userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  addres: String,
  phone: String,
  username: { type: String, required: true },
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
  password: String,
  salt: String,
  isAdmin: Boolean,
  receiveNotification: { type: Boolean, default: false },
});

userSchema
  .virtual("password_confirmation")
  .get(() => {
    return this.p_c;
  })
  .set((password) => {
    this.p_c = password;
  });

let userModel = new mongoose.model("User", userSchema);

module.exports.userModel = userModel;
