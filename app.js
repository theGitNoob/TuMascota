"use strict";
let express = require("express");
// let compression = require("compression");
let session = require("express-session");
let methodOverride = require("method-override");
// let sessionMiddleware = require("./middlewares/session-middleware");
let adminRouter = require("./routes/admin/admin-routes");
let user = require("./routes/usuarios");
let pets = require("./routes/mascotas");
let orders = require("./routes/ordenes");
let accesories = require("./routes/accesorios");
let services = require("./routes/servicios");
let passport = require("passport");
let flash = require("connect-flash");
const MongoStore = require("connect-mongo");

let app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false })); //

app.use(
  "/public",
  express.static("public", {
    // maxAge: "10h", //con esta opcion puedo definir la duracio del los archivos en cache super rapido
  })
);

app.use(methodOverride("_method"));

app.set("view engine", "pug"); //establece el motor de vistas a usar
app.disable("x-powered-by");

app.use(
  session({
    secret: "123the cat is falling in love",
    resave: false,
    name: "sessionID",
    saveUninitialized: false,
    cookie: {
      maxAge: 18000000,
    },
    store: MongoStore.create({
      mongoUrl: "mongodb://localhost/users",
      collectionName: "sessions",
      autoRemove: "interval",
      autoRemoveInterval: 10,
      touchAfter: 24 * 3600,
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

// let compiledIndex = pug.compileFile("./views/index.pug");
//Tengo q recompilar cada vez q realizo un cambio a la pagina

app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

app.get("*", (req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

app.get("/", (req, res) => {
  res.render("index");
  //   res.send(compiledIndex());
});

app.use("/users", user);

app.use("/mascotas", pets);
app.use("/accesorios", accesories);
app.use(
  "/ordenes",
  (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.status(404).send("La pagina q esta buscando no existe");
    }
  },
  orders
);
// app.use("/servicios", services);

app.use(
  "/admin",
  (req, res, next) => {
    if (req.isAuthenticated() && req.user.isAdmin) {
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
app.listen(8080, (err) => {
  console.log("Servidor corriendo en el puerto 8080");
});

// let nodemailer = require("nodemailer");

// let transporter = nodemailer.createTransport({
//   host: "smtp.nauta.cu",
//   port: 25,
//   secure: false, // upgrade later with STARTTLS
//   auth: {
//     user: "racosta011220@nauta.cu",
//     pass: "qmxU9qqw",
//   },
//   tls: {
//     // do not fail on invalid certs
//     rejectUnauthorized: false,
//   },
// });

// var message = {
//   from: "racosta011220@nauta.cu",
//   to: "racosta011220@gmail.com",
//   subject: "Hola mundo por correo",
//   text: "Hola Mundo en texto plano",
//   html: "<p>Hello World from html</p>",
// };

// transporter.sendMail(message, (err) => {
//   console.log(err);
// });
// transporter.verify(function (error, success) {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log("Server is ready to take our messages");
//   }
// });
