let express = require("express");
let router = express.Router();
let User = require("../models/user-model");
let Order = require("../models/order-model");
let Pet = require("../models/pet-model");
let redis = require("redis");
const { check } = require("express-validator");
let redisClient = redis.createClient();

//TODO: usar express validator para validadar las ordenes

router.route("/").get(async (req, res) => {
  try {
    let obj = Object.keys(req.query);
    let filters = [];
    console.log(req.query);
    obj.forEach((elem) => {
      if (req.query[elem] === "on") {
        filters.push(elem);
      }
    });

    let findOpts = { status: "available" };
    if (filters.length) {
      findOpts.type = { $in: filters };
    }

    const mascotas = await Pet.find(findOpts).exec();

    let opts = { mascotas: mascotas };

    filters.forEach((element) => {
      opts[element] = true;
    });

    res.render("mascotas", opts);
  } catch (err) {
    console.error(err);
    // next(err)
    // res.redirect("/");
  }
});

router.get("/:id/images/", async (req, res) => {
  const id = req.params.id;
  const pet = await Pet.findById(id).exec();
  res.json(pet.images);
});

module.exports = router;
