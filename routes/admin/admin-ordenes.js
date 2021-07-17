"use strict";
let router = require("express").Router();
let orderModel = require("../../models/order").orderModel;
let fs = require("fs/promises");
let mongoose = require("mongoose");
let multer = require("multer");
var upload = multer({ dest: "./uploads/" });
let petModel = require("../../models/pet").petModel;
let accesoriesModel = require("../../models/accesorie").accesoriesModel;
let userModel = require("../../models/user").userModel;
router.get("/", async (req, res) => {
  try {
    let orders = await orderModel.find().populate("owner");
    res.render("index-ordenes", { ordenes: orders });
  } catch (err) {
    console.error(err);
  }
});

router
  .route("/:id")
  .get(async (req, res) => {})
  .put(async (req, res) => {
    try {
      let order = await orderModel.findById(req.params.id);
      if (order === null) {
        req.flash("alert alert-danger", "El articulo ya no existe");
        res.redirect("/admin/ordenes/");
        return;
      }
      let article =
        order.articleType == "mascota"
          ? await petModel.findById(order.articleId)
          : await accesoriesModel.findById(order.articleId);

      let user = await userModel.findById(order.owner);

      if (
        order.state === "pendient" ||
        order.state === "onway" ||
        order.state === "aproved"
      ) {
        order.state = req.body.state;
        if (order.state === "aproved") {
          user.messages.push({
            msg: "Su órden ha sido aprobada",
            date: Date(),
          });
          user.notifications++;
        } else if (order.state === "onway") {
          user.messages.push({
            msg: "Su órden ahora está en camino",
            date: Date(),
          });
          user.notifications++;
        } else if (req.body.state === "canceled") {
          article.stagedCnt -= order.cnt;
          article.cnt += order.cnt;
          user.messages.push({
            msg: "Su órden ha sido cancelada",
            date: Date(),
          });
          user.notifications++;
          if (user.toBeDelivered) user.toBeDelivered--;
        } else if (req.body.state === "completed") {
          article.stagedCnt -= order.cnt;
          if (user.toBeDelivered) user.toBeDelivered--;
        }
      } else {
        res.send("No puede cambiar el estado de una orden ya cancelada");
      }

      await user.save();
      await order.save();

      res.redirect("/admin/ordenes");
    } catch (error) {
      console.error(error);
    }
  })
  .delete(async (req, res) => {
    try {
      // Notificar usuario que su orden fue eliminada
      let order = await orderModel.findById(req.params.id);
      if (order === null) {
        req.flash("alert alert-danger", "El articulo ya no existe");
        res.redirect("/admin/ordenes/");
        return;
      }
      let article =
        order.articleType == "mascota"
          ? await petModel.findById(order.articleId)
          : await accesoriesModel.findById(order.articleId);

      article.cnt += order.cnt;
      article.stagedCnt -= order.cnt;
      article.available = article.cnt === 0 ? false : true;

      await article.save({ validateModifiedOnly: true });
      await order.deleteOne();

      let user = await userModel.findById(order.owner);
      user.orders;
      if (order.state !== "canceled") {
        user.messages.push({
          msg: `Su órden con id: ${order._id} ha sido eliminada`,
          date: Date(),
        });
        user.toBeDelivered--;
        notifications++;
      }
      await user.save();
      res.redirect("/admin/ordenes");
    } catch (err) {
      console.error(err);
    }
  });

module.exports = router;
