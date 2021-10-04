"use strict";
require("dotenv").config();
require("./config/db-config")();
const express = require("express");
const logger = require("morgan");
// let compression = require("compression");
let session = require("express-session");
let methodOverride = require("method-override");
const { checkAuth, noAuth } = require("./middlewares/session-middleware");
const adminRouter = require("./routes/admin/admin-routes");
const usersRouter = require("./routes/usuarios-route");
const userRouter = require("./routes/user-route");
const petsRouter = require("./routes/mascotas");
const orders = require("./routes/ordenes");
const accesories = require("./routes/accesorios");
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
const { userModel } = require("./models/user-model");

app.use(express.json());
app.use(express.urlencoded({ extended: false })); //
// app.use(helmet());
app.use(
  "/public",
  express.static("public", {
    // maxAge: "10h", //con esta opcion puedo definir la duracion del los archivos en cache super rapido
  })
);

app.use(logger("dev"));
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

app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

app.get("*", (req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

app.get("/", async (req, res, next) => {
  res.render("index");
});

app.use("/users", noAuth, usersRouter);
app.use("/user", checkAuth, userRouter);

app.use("/mascotas", petsRouter);
app.use("/accesorios", accesories);

app.use("/ordenes", orders);
// app.use("/servicios", services);

app.use(
  "/admin",
  (req, res, next) => {
    if (req.isAuthenticated() && req.user.role == "ADMIN_ROLE") {
      next();
    } else {
      console.log(req.user);
      res.status(404);
      res.render("404");
      // res.status(404).send("La pagina q esta buscando no existe");
    }
  },
  adminRouter
);

app.use((req, res, next) => {
  res.status(404);
  res.render("404");
  // res.status(404).send("La pagina q esta buscando no existe");
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  console.error(err);
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("500");
});

server.listen(process.env.PORT, (err) => {
  console.log("Servidor corriendo en el puerto 8080");
});

//TODO:Volver a poner en funcionamiento socket.io

//TODO:Apr3nder a usar Bluerbird, async, PM2, Cluster
//TODO:Cambiar las variables de entorno cuando la app este en produccion
//TODO:Entender el XSS y como prevenirlo
//FIXME:Arreglar el error en new-pet y new-accesorie que hace que al eliminar las fotos aun se envien
