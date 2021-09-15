"use strict";
const router = require("express").Router();
const Order = require("../../models/order-model");
const Pet = require("../../models/pet-model");
const Accesorie = require("../../models/accesorie-model");
const User = require("../../models/user-model");

//TODO:Refactorizar codigo
router.get("/", async (req, res, next) => {
  try {
    const ordenes = await Order.find({ state: /pendient|aproved/ })
      .populate("user")
      .exec();
    res.render("index-ordenes", { ordenes });
  } catch (err) {
    next(err);
  }
});

router
  .route("/:id")
  .put(async (req, res, next) => {
    try {
      const { state } = req.body;

      let order = await Order.findById(req.params.id);
      if (!order) {
        // req.flash("alert alert-danger", "El articulo ya no existe");
        // res.redirect("/admin/ordenes/");
        return res.status(400).json({ msg: "La orden ya no existe" });
      }
      let article =
        order.type == "pet"
          ? await Pet.findById(order.pet).exec()
          : await Accesorie.findById(order.accesorie).exec();

      let user = await User.findById(order.user).exec();

      //TODO: Proponerle a Jesus simplificar la interfaz y dejarla en pendiente aprobada y completada

      if (order.state != "completed") {
        order.state = state;
        switch (state) {
          case "aproved":
            user.messages.push({
              msg: "Su órden ha sido aprobada",
            });
            user.newMessages++;
            break;
          case "completed":
            article.stagedCnt -= order.cnt;
            if (user.orders) user.orders--;
            break;
          default:
            return res.status(400).json({ msg: "El estado no es vàlido" });
        }
      } else {
        return res.status(400).json({
          msg: "No puede cambiar el estado de una orden ya completada",
        });
      }

      await user.save();
      await order.save();

      return res.end();
    } catch (err) {
      next(err);
    }
  })
  .delete(async (req, res, next) => {
    try {
      // Notificar usuario que su orden fue eliminada
      let order = await Order.findById(req.params.id).exec();

      if (!order) {
        return res.status(400).json({ msg: "La orden ya no existe" });
      }

      let article =
        order.articleType === "mascota"
          ? await Pet.findById(order.articleId).exec()
          : await Accesorie.findById(order.articleId).exec();

      let user = await User.findById(order.user).exec();

      switch (order.state) {
        case "pendient":
        case "aproved":
          article.cnt += order.cnt;
          article.stagedCnt -= order.cnt;
          break;
        case "completed":
          break;
        default:
          return res.status(400).json({ msg: "El estado no es vàlido" });
      }

      user.orders--;

      await order.deleteOne();
      await article.save({ validateModifiedOnly: true });
      await user.save();
    } catch (err) {
      next(err);
    }
  });

module.exports = router;
