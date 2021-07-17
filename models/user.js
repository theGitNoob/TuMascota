"use strict";
let mongoose = require("mongoose");
let validator = require("validator");
let parsePhone = require("../utils").parsePhone;

let messageSchema = new mongoose.Schema({
  msg: { type: String },
  date: { type: Date },
});
messageSchema.virtual("fullDate").get(function () {
  let ms = new Date().getTime() - this.date.getTime();
  let secs = Math.trunc(ms / 1000);
  let mins = Math.trunc(secs / 60);
  let hs = Math.trunc(mins / 60);
  let days = Math.trunc(hs / 24);
  let weeks = Math.trunc(days / 7);
  let months = Math.trunc(days / 30);
  let years = Math.trunc(months / 12);
  if (years) {
    return `Hace ${years} año${years > 1 ? "s" : ""}`;
  } else if (months) {
    return `Hace ${months} mes${months > 1 ? "es" : ""}`;
  } else if (weeks) {
    return `Hace ${weeks} semana${weeks > 1 ? "s" : ""}`;
  } else if (days) {
    return `Hace ${days} día${days > 1 ? "s" : ""}`;
  } else if (hs) {
    return `Hace ${hs} hora${hs > 1 ? "s" : ""}`;
  } else if (mins) {
    return `Hace ${mins} minuto${mins > 1 ? "s" : ""}`;
  } else {
    return `Justo ahora`;
  }
});

let userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  addres: String,
  phone: String,
  username: { type: String, required: true },
  password: String,
  messages: [messageSchema],
  notifications: { type: Number, default: 0 },
  isAdmin: Boolean,
  verifyURL: String,
  toBeDelivered: { type: Number, default: 0 },
  confirmed: { type: Boolean, default: false },
  receiveNotification: { type: Boolean, default: false },
});

// userSchema
//   .virtual("password2")
//   .get(() => {
//     return this.p_c;
//   })
//   .set((password) => {
//     this.p_c = password;
//   });

let userModel = new mongoose.model("User", userSchema);

module.exports.userModel = userModel;
