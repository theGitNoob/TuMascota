let express = require("express");
let bodyParser = require("body-parser"); // Parse incoming request bodies in a middleware, available as req.body
const pug = require("pug");
let moongose = require("mongoose");
let adminModel = require("./models/admin-user.js");

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); //

app.set("view engine", "pug"); //establece el motor de vistas a usar

app.use("/public", express.static("public", { cache: false })); // ruta q me permite servir archivos estaticos

// let compiledIndex = pug.compileFile("./views/index.pug");
//Tengo q recompilar cada vez q realizo un cambio a la pagina

app.get("/", (req, res) => {
  //   res.send(compiledIndex());
  res.render("index");
});

app.get("/admin/", (req, res) => {
  console.log(req.params);
  res.render("admin");
});

app.post("/admin/uservalidation", (req, res) => {
  console.log(req.body.username);
  console.log(req.body.password);
  res.end();
});

app.listen(8080);
