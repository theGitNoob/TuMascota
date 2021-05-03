"use strict";
let express = require("express");
let compression = require("compression");
let session = require("express-session");
let cookieSession = require("cookie-session");
let methodOverride = require("method-override");
let sessionMiddleware = require("./middlewares/session-middleware");
let adminRouter = require("./admin-routes");
let router = require("./routes");
let petModel = require("./models/pet").petModel;

const { Mongoose } = require("mongoose");

let app = express();

app.disable("x-powered-by");
app.use(
  session({
    secret: "123the cat is falling in love",
    resave: false,
    saveUninitialized: false,
  })
);

// app.use(
//   cookieSession({
//     name: "idSession",
//     keys: ["rafa01", "dsadasadsfdg"],
//     cookie: {
//       secure: true,
//       httpOnly: true,
//     },
//   })
// );

app.use(express.json());
app.use(express.urlencoded({ extended: false })); //

app.use(methodOverride("_method"));

app.set("view engine", "pug"); //establece el motor de vistas a usar

app.use(
  "/public",
  express.static("public", {
    // maxAge: "10h", //con esta opcion puedo definir la duracio del los archivos en cache super rapido
  })
); // ruta q me permite servir archivos estaticos

// let compiledIndex = pug.compileFile("./views/index.pug");
//Tengo q recompilar cada vez q realizo un cambio a la pagina
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});
app.get("/", (req, res) => {
  //   res.send(compiledIndex());
  res.render("index");
});

app.use(sessionMiddleware);
app.use("/", router);
app.use("/admin", adminRouter);

app.listen(8080, (err) => {
  console.log("Servidor corriendo en el puerto 8080");
});
