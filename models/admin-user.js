let mongoose = require("mongoose");
let Schema = mongoose.Schema;

//"mongodb://localhost/TuMascota"
//manejar el error en caso de desconexion de la BD
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .catch((err) => {
    console.error("Error:", err, process.env.MONGODB_URL);
  });

let AdminUserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "El password es demasiado corto"],
  },
});

let adminModel = mongoose.model("admin", AdminUserSchema);
module.exports.adminModel = adminModel;
