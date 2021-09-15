const { connect } = require("mongoose");

//"mongodb://localhost/TuMascota"
//manejar el error en caso de desconexion de la BD
const connectDB = async () => {
  try {
    await connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("DB Online");
  } catch (err) {
    console.error("Error:", err, process.env.MONGODB_URL);
  }
};
module.exports = connectDB;
