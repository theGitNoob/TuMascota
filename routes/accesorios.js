let router = require("express").Router();
let userModel = require("../models/user").userModel;
let orderModel = require("../models/order").orderModel;
let accesoriesModel = require("../models/accesorie").accesoriesModel;

router.get("/", async (req, res) => {
  try {
    let accesorios = await accesoriesModel.find({ available: true });
    res.render("accesorios", { accesorios: accesorios });
  } catch (err) {
    console.error(err);
  }
});

router.post("/ordenes/:id", async (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash(
      "alert alert-danger",
      "Debe iniciar sesion antes de realizar un pedido"
    );
    res.redirect("/users/login");
    return;
  }
  try {
    let accesorie = await accesoriesModel.findById(req.params.id);
    if (accesorie == null) {
      res.redirect("/accesorios");
    }

    let user = await userModel.findById(req.user.id);
    if (user == null) {
      res.redirect("/accesorios");
    }

    if (accesorie.available) {
      let cnt = req.body.cnt > accesorie.cnt ? accesorie.cnt : req.body.cnt;

      let date = new Date();
      let month = date.getMonth();
      month++;
      let fullDate =
        date.getUTCDate() + "/" + month + "/" + date.getUTCFullYear();

      let newOrder = new orderModel({
        articleId: accesorie._id,
        articleType: "accesorio",
        owner: user._id,
        cnt: cnt,
        price: cnt * accesorie.price,
        requestDate: fullDate,
      });

      await newOrder.save();
      user.toBeDelivered++;
      await user.save();
      accesorie.cnt -= cnt;
      accesorie.stagedCnt += cnt;
      accesorie.available = accesorie.cnt == 0 ? false : true;

      await accesorie.save({ validateModifiedOnly: true });

      res.redirect("/accesorios");
    } else {
      // la mascota no esta disponible ya notificar de esto
      res.send("Lo sentimoas la mascota no s eencuentra disponible");
    }
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
