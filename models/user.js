let mongoose = require("mongoose");
let validator = require("validator");
let parsePhone = require("../utils").parsePhone;

let userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    validate: [validator.isEmail, "El email es inválido"],
  },
  phone: {
    type: String,
    validate: {
      validator: function (phone) {
        phone = parsePhone(phone);
        if (phone.length != 8 || !validator.isNumeric(phone)) return false;

        //validar q el # exista
        return true;
      },
      message: "El número de télefono introducido no es correcto",
    },
  },
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (p) {
        return this.password_confirmation == p;
      },
      message: "Las contraseñas no coinciden",
    },
  },
  receiverNotification: { type: Boolean, default: false },
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
