let mongoose = require("mongoose");
let validator = require("validator");

let userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, validate: validator.isEmail },
  phone: {
    type: String,
    validate: {
      validator: function (phone) {
        phone = phone.replace(/ /g, "");
        if (phone[0] == "+") phone = phone.substring(1);
        if (phone.length != 10 || phone.length != 8) return false;
        if (phone.length == 10) phone = phone.substring(2);

        //validar q el # exista
        return true;
      },
    },
  },
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
  password: { type: String, required: true },
});

let userModel = new mongoose.model("User", userSchema);

module.exports.userModel = userModel;
