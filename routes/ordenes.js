"use strict";
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
    for await (const order of orders) {
      try {
        if (order.articleType == "mascota") {
          let pet = await petModel.findById(order.articleId);
          order.pet = pet;
          console.log(order);
        } else {
          let accesorie = await accesoriesModel.findById(order.articleId);
          order.accesorie = accesorie;
          console.log(order);
        }
      } catch (error) {
        next(error);
        return;
      }
    }
    console.log("render");
    res.render("ordenes", { ordenes: orders });
  } catch (error) {
    next(error);
  }
});
router
  .route("/:id/cancel")
  .post(async (req, res, next) => {
    try {
      let order = await orderModel.findById(req.params.id);
      if (order === null) {
        req.flash("alert alert-danger", "El articulo ya no existe");
        res.redirect("/ordenes");
        return;
      }
      if (req.user._id == order.owner) {
        next();
        return;
      }
      if (order.state !== "pendient") {
        res.redirect("/ordenes");
        return;
      }

      let article =
        order.articleType == "mascota"
          ? await petModel.findById(order.articleId)
          : await accesoriesModel.findById(order.articleId);

      let user = await userModel.findById(order.owner);
      article.cnt += order.cnt;
      article.stagedCnt -= order.cnt;
      article.available = article.cnt === 0 ? false : true;

      order.state = "canceled";
      if (user.toBeDelivered) {
        user.toBeDelivered--;
      }
      await article.save({ validateModifiedOnly: true });
      await user.save();
      await order.save();

      res.sendStatus(200).end();
    } catch (error) {
      next(error);
    }
  })
  .delete(async (req, res, next) => {
    try {
      throw new Error("rafa");
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

module.exports = router;
