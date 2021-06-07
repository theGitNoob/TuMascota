let express = require("express");
let router = express.Router();
let userModel = require("../models/user").userModel;
let orderModel = require("../models/order").orderModel;
let petModel = require("../models/pet").petModel;
let redis = require("redis");

let redisClient = redis.createClient();

router.get("/order/:id", (req, res) => {
  res.send("No jodas mas");
});

router.post("/ordenes/:id", async (req, res) => {
  if (!req.isAuthenticated()) {
    // req.flash("alert-error", "Debe iniciar sesion antes de realizar un pedido");
    // res.redirect("/users/login");
    res.sendStatus(404).end();
    return;
  }
  try {
    let pet = await petModel.findById(req.params.id);

    if (pet == null) {
      res.sendStatus(404).end();
      return;
    }

    let user = await userModel.findById(req.user.id);

    if (user == null) {
      res.sendStatus(404).end();
      return;
    }

    if (pet.available) {
      let cnt = req.body.cnt > pet.cnt ? pet.cnt : req.body.cnt;

      let date = new Date();
      let month = date.getMonth();
      month++;
      let fullDate =
        date.getUTCDate() + "/" + month + "/" + date.getUTCFullYear();
      let newOrder = new orderModel({
        articleId: pet._id,
        articleType: "mascota",
        owner: user._id,
        cnt: cnt,
        price: cnt * pet.price,
        requestDate: fullDate,
      });

      await newOrder.save();
      user.toBeDelivered++;
      await user.save();
      pet.cnt -= cnt;
      pet.stagedCnt += cnt;
      pet.available = pet.cnt == 0 ? false : true;

      await pet.save({ validateModifiedOnly: true });
      let info = { id: pet._id, cnt: pet.cnt };
      redisClient.publish("product", JSON.stringify(info));
      res.sendStatus(200).end();
      // res.redirect("/mascotas");
    } else {
      res
        .send("Lo sentimoas la mascota no s eencuentra disponible")
        .status(404);
    }
  } catch (err) {
    console.error(err);
  }
});

router
  .route("/")
  .get(async (req, res) => {
    try {
      let obj = Object.keys(req.query);
      let filters = [];

      obj.forEach((elem) => {
        if (req.query[elem] === "on") {
          filters.push(elem);
        }
      });

      let findOpts = { available: true };
      if (filters.length) {
        findOpts.type = { $in: filters };
      }

      let mascotas = await petModel.find(findOpts);

      let opts = { mascotas: mascotas };

      filters.forEach((element) => {
        opts[element] = true;
      });

      res.render("mascotas", opts);
    } catch (err) {
      console.error(err);
      res.redirect("/");
    }
  })
  .post(async (req, res) => {
    // try {
    //   let json = JSON.parse(JSON.stringify(req.body));
    //   let filters = Object.keys(json);
    //   let findOpts = { available: true };
    //   if (filters.length) {
    //     findOpts.type = { $in: filters };
    //   }
    //   let mascotas = await petModel.find(findOpts);
    //   let opts = { mascotas: mascotas };
    //   filters.forEach((element) => {
    //     opts[element] = true;
    //   });
    //   res.render("mascotas2", opts);
    // } catch (err) {
    //   console.error(err);
    // }
  });
module.exports = router;
