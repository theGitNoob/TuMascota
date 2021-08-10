"use strict";
const router = require("express").Router();
const Order = require("../../models/order-model");
const Pet = require("../../models/pet-model");
const Accesorie = require("../../models/accesorie-model");
const User = require("../../models/user-model");
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().populate("user").exec();
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
      let order = await Order.findById(req.params.id);
      if (order === null) {
        req.flash("alert alert-danger", "El articulo ya no existe");
        res.redirect("/admin/ordenes/");
        return;
      }
      let article =
        order.type == "pet"
          ? await Pet.findById(order.pet)
          : await Accesorie.findById(order.accesorie);

      let user = await User.findById(order.user);

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
          if (user.orders) user.orders--;
        } else if (req.body.state === "completed") {
          article.stagedCnt -= order.cnt;
          if (user.orders) user.orders--;
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
      let order = await Order.findById(req.params.id);
      if (order === null) {
        req.flash("alert alert-danger", "El articulo ya no existe");
        res.redirect("/admin/ordenes/");
        return;
      }
      let article =
        order.articleType == "mascota"
          ? await Pet.findById(order.articleId)
          : await Accesorie.findById(order.articleId);

      article.cnt += order.cnt;
      article.stagedCnt -= order.cnt;
      article.available = article.cnt === 0 ? false : true;

      await article.save({ validateModifiedOnly: true });
      await order.deleteOne();

      let user = await User.findById(order.owner);
      user.orders;
      if (order.state !== "canceled") {
        user.messages.push({
          msg: `Su órden con id: ${order._id} ha sido eliminada`,
          date: Date(),
        });
        user.orders--;
        notifications++;
      }
      await user.save();
      res.redirect("/admin/ordenes");
    } catch (err) {
      console.error(err);
    }
  });

module.exports = router;
