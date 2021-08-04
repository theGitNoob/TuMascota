let express = require("express");
let router = express.Router();
let User = require("../models/user");
let orderModel = require("../models/order").orderModel;
let petModel = require("../models/pet").petModel;
let redis = require("redis");
const { check } = require("express-validator");
let redisClient = redis.createClient();

//TODO: usar express validator para validadar las ordenes
router.post(
  "/ordenes/:id",
  [
    check("cnt", "La cantidad no debe estar vacía").notEmpty(),
    check("id", "").isMongoId(),
  ],
  async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).end();
    }
    try {
      let pet = await petModel.findById(req.params.id);

      if (pet == null) {
        return res.status(401).json({ msg: "No available" });
      }

      let user = await User.findById(req.user.id);

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
        console.log("not available");
        res.sendStatus(404).end();
      }
    } catch (err) {
      console.error(err);
    }
  }
);

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

router.get("/:id/images/", async (req, res) => {
  const id = req.params.id;
  const pet = await petModel.findById(id);
  res.json(pet.images);
});
module.exports = router;
