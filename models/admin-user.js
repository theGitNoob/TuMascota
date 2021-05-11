let mongoose = require("mongoose");
let Schema = mongoose.Schema;

//"mongodb://localhost/TuMascota"
mongoose.connect("mongodb://localhost/users", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

let adminUserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    validate: {
      validator: function (p) {
        return this.password_confirmation == p;
      },
    },
    required: true,
    minlength: [8, "El password es demasiado corto"],
  },
});

adminUserSchema
  .virtual("password_confirmation")
  .get(() => {
    return this.p_c;
  })
  .set((password) => {
    this.p_c = password;
  });

let adminModel = mongoose.model("admin", adminUserSchema);
module.exports.adminModel = adminModel;
