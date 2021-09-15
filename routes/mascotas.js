let express = require("express");
let router = express.Router();
let Pet = require("../models/pet-model");
let redis = require("redis");
let redisClient = redis.createClient();

router.route("/").get(async (req, res, next) => {
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
    // next(err);
    // res.redirect("/");
  }
});

router.get("/:id/images/", async (req, res, next) => {
  const id = req.params.id;
  const pet = await Pet.findById(id).exec();

  if (!pet) {
    return next();
  }

  res.json(pet.images.map(({ url }) => url));
});

module.exports = router;
