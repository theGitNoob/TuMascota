"use strict";
let express = require("express");
let bodyParser = require("body-parser"); // Parse incoming request bodies in a middleware, available as req.body
let compression = require("compression");
let session = require("express-session");
let methodOverride = require("method-override");
let sessionMiddleware = require("./middlewares/session-middleware");
let router = require("./admin-routes");
const { Mongoose } = require("mongoose");

let app = express();

app.use(
  session({
    secret: "123the cat is falling in love",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); //

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

app.get("/", (req, res) => {
  //   res.send(compiledIndex());
  res.render("index");
});

app.use("/admin", sessionMiddleware);
app.use("/admin", router);
app.use("/admin", (err, req, res, next) => {
  res.status(500).send({ error: err });

  // console.error(err);
  console.log(req.params.id);
});
app.listen(8080);
