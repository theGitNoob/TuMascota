"@use-strict";
let router = require("express").Router();
let orderModel = require("../models/order").orderModel;
let fs = require("fs/promises");
let mongoose = require("mongoose");
let multer = require("multer");
var upload = multer({ dest: "./uploads/" });
let petModel = require("../models/pet").petModel;
let accesoriesModel = require("../models/accesorie").accesoriesModel;
let userModel = require("../models/user").userModel;

router.get("/", async (req, res, next) => {
  try {
    let orders = await orderModel.find({ owner: req.user.id });
    res.json(orders);
  } catch (error) {
    next(error);
  }
});
router
  .route("/:id")
  .put(async (req, res, next) => {
    try {
    } catch (error) {
      next(error);
    }
  })
  .delete(async (req, res, next) => {
    try {
    } catch (error) {
      next(error);
    }
  });

module.exports = router;
