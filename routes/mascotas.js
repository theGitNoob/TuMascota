let express = require("express");
let router = express.Router();
let userModel = require("../models/user").userModel;
let orderModel = require("../models/order").orderModel;
let petModel = require("../models/pet").petModel;

router.get("/order/:id", (req, res) => {
  res.send("No jodas mas");
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
    let pet = await petModel.findById(req.params.id);
    if (pet == null) {
      res.redirect("/mascotas");
    }

    let user = await userModel.findById(req.user.id);
    console.log(user);

    if (pet.available) {
      let cnt = req.body.cnt > pet.cnt ? pet.cnt : req.body.cnt;

      let newOrder = new orderModel({
        articleId: pet._id,
        articleType: "mascota",
        owner: user._id,
        cnt: cnt,
        price: cnt * pet.price,
      });

      await newOrder.save();

      pet.cnt -= cnt;
      pet.stagedCnt += cnt;
      pet.available = pet.cnt == 0 ? false : true;

      await pet.save({ validateModifiedOnly: true });

      res.redirect("/mascotas");
    } else {
      res.send("Lo sentimoas la mascota no s eencuentra disponible");
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
