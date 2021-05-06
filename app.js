"use strict";
let express = require("express");
// let compression = require("compression");
let session = require("express-session");
let methodOverride = require("method-override");
// let sessionMiddleware = require("./middlewares/session-middleware");
let adminRouter = require("./routes/admin/admin-routes");
let user = require("./routes/usuarios");
let pets = require("./routes/mascotas");
let accesories = require("./routes/accesorios");
let services = require("./routes/servicios");
let passport = require("passport");
let flash = require("connect-flash");
const MongoStore = require("connect-mongo");

let app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false })); //

app.disable("x-powered-by");

app.use(
  session({
    secret: "123the cat is falling in love",
    resave: false,
    name: "sessionID",
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: "mongodb://localhost/users",
      collectionName: "sessions",
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

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

app.use("/users", user);
app.use("/mascotas", pets);
app.use("/accesorios", accesories);
// app.use("/servicios", services);

app.use(
  "/admin",
  (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.status(404).send("La pagina q esta buscando no existe");
    }
  },
  adminRouter
);

app.use((req, res) => {
  res.status(404).send("La pagina q esta buscando no existe");
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
app.listen(3000, () => {
  console.log("Servidor iniciado correctamente");
});
module.exports = app;

app.listen(8080, (err) => {
  console.log("Servidor corriendo en el puerto 8080");
});
