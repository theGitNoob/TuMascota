"use strict";
require("dotenv").config();
const express = require("express");
// let compression = require("compression");
let session = require("express-session");
let methodOverride = require("method-override");
// let sessionMiddleware = require("./middlewares/session-middleware");
const adminRouter = require("./routes/admin/admin-routes");
const user = require("./routes/usuarios");
const pets = require("./routes/mascotas");
const orders = require("./routes/ordenes");
const accesories = require("./routes/accesorios");
const services = require("./routes/servicios");
const passport = require("passport");
let flash = require("connect-flash");
let app = express();
let http = require("http");
var server = http.createServer(app);
let io = require("socket.io")(server);
let passportSocketIo = require("passport.socketio");
let redis = require("redis");
let RedisStore = require("connect-redis")(session);
let cookieParser = require("cookie-parser");
let helmet = require("helmet");

app.use(express.json());
app.use(express.urlencoded({ extended: false })); //
// app.use(helmet());

app.use(
  "/public",
  express.static("public", {
    maxAge: "10h", //con esta opcion puedo definir la duracion del los archivos en cache super rapido
  })
);

app.use(methodOverride("_method"));

app.set("view engine", "pug"); //establece el motor de vistas a usar
// app.disable("x-powered-by");

let sessionStore = new RedisStore({ client: redis.createClient() });

let expressSession = session({
  secret: "123the cat is falling in love",
  resave: false,
  name: "sessionID",
  saveUninitialized: false,
  cookie: {
    maxAge: 18000000,
    sameSite: true,
  },
  store: sessionStore,
});

app.use(expressSession);

app.use(passport.initialize());
app.use(passport.session());

io.use(
  passportSocketIo.authorize({
    cookieParser: cookieParser,
    key: "sessionID",
    secret: "123the cat is falling in love",
    store: sessionStore,
    passport: passport,
  })
);

let suscriberClient = redis.createClient();

suscriberClient.subscribe("product");

suscriberClient.on("message", (channel, message) => {
  if (channel == "product") {
    // console.log(message);
    io.emit("product update", message);
  }
});
io.on("connection", (socket) => {
  if (socket.request.isAuthenticated()) {
    // console.log("socket whith id: " + socket.id + " was connected");
    socket.on("disconnect", () => {
      // console.log("socket disconnected");
    });
  }
});

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

app.get("/", (req, res, next) => {
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
      // res.status(404).send("La pagina q esta buscando no existe");
      res.render("404");
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
      res.render("404");
      // res.status(404).send("La pagina q esta buscando no existe");
    }
  },
  adminRouter
);

app.use((req, res) => {
  res.render("404");
  // res.status(404).send("La pagina q esta buscando no existe");
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("500");
});

server.listen(8080, (err) => {
  console.log("Servidor corriendo en el puerto 8080");
});

//TODO: clear something
//FIXME: Fix something

// const { Schema, model, connect } = require("mongoose");

// connect("mongodb://localhost/ttlTest", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useCreateIndex: true,
//   useFindAndModify: false,
// }).catch((err) => {
//   console.error("Error:", err, "mongodb://localhost/ttlTest");
// });
// const testSchema = new Schema({
//   name: String,
//   age: Number,
//   // link: { type: String, expires: new Date().now + 60 },
//   expireAt: {
//     type: Date,
//     default: Date.now,
//     index: { expires: 240 },
//   },
// });

// const mod = model("TTL", testSchema);
// async function f() {
//   let x = new mod({ name: "rafa", age: 18, link: "Pepe" });
//   let z = await x.save();
//   console.log(z);
// }
// f();
