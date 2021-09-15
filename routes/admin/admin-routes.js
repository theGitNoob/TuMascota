"use strict";
let express = require("express");

let router = express.Router();
let petRouter = require("./admin-mascotas");
let accesoriesRouter = require("./admin-accesorios");
let ordersRouter = require("./admin-ordenes");

router.get("/", (req, res, next) => {
  res.render("admin");
});

//Rutas relacionadas a la administracion de mascotas
router.use("/mascotas", petRouter);

//Rutas relacionadas a la administracion de accesorios

router.use("/accesorios", accesoriesRouter);

//
router.use("/ordenes", ordersRouter);
module.exports = router;
