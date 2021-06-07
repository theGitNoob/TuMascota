let router = require("express").Router();
let userModel = require("../models/user").userModel;
let orderModel = require("../models/order").orderModel;
let accesoriesModel = require("../models/accesorie").accesoriesModel;
let redis = require("redis");

let redisClient = redis.createClient();

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
    // req.flash(
    //   "alert alert-danger",
    //   "Debe iniciar sesion antes de realizar un pedido"
    // );
    res.sendStatus(404).end();
    return;
  }
  try {
    let accesorie = await accesoriesModel.findById(req.params.id);
    if (accesorie == null) {
      res.sendStatus(404).end();
      return;
    }

    let user = await userModel.findById(req.user.id);
    if (user == null) {
      res.sendStatus(404).end();
      return;
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

      let info = { id: accesorie._id, cnt: accesorie.cnt };
      redisClient.publish("product", JSON.stringify(info));

      res.sendStatus(200).end();
    } else {
      res.send("Lo sentimoas la mascota no s eencuentra disponible");
    }
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
