let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let adminUserSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

let adminModel = mongoose.model("admin", adminUserSchema);
module.exports.adminModel = adminModel;
