const { connect } = require("mongoose");

//"mongodb://localhost/TuMascota"
//manejar el error en caso de desconexion de la BD
const connectDB = async () => {
  try {
    //FIXME:Hacer que se reconecte
    await connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      keepAlive: true,
      keepAliveInitialDelay: 300000,
    });
    console.log("DB Online");
  } catch (err) {
    console.error("Error when attempting to connect DB", err);
    process.exit(1);
  }
};
module.exports = connectDB;
