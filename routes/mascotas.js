let express = require("express");
let router = express.Router();
let Pet = require("../models/pet-model");
let redis = require("redis");
const { check } = require("express-validator");
const { validationResult } = require("express-validator");
let redisClient = redis.createClient();

router.route("/").get(async (req, res, next) => {
  try {
    const { otros, ...queryParams } = req.query;

    const queryObj = Object.keys(queryParams);

    const filters = queryObj.filter((elem) => queryParams[elem] === "on");

    let regex = "";
    if (otros === "on") {
      const types = ["perro", "gato", "ave", "roedor", "pez"];
      const exclude = types.filter((elem) => !filters.includes(elem));
      regex = `^(?!${exclude.join("|") || "$"})([a-z0-9]+)$`;
    } else {
      regex = filters.join("|");
    }
    console.log(regex);
    const mascotas = await Pet.find({
      type: RegExp(regex, "i"),
      status: "available",
    }).exec();

    res.render("mascotas", { mascotas, ...req.query });
  } catch (err) {
    next(err);
  }
});

router.get(
  "/:id/images/",
  check("id", "").isMongoId(),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ msg: "invalid id" });
      }

      const pet = await Pet.findById(id).exec();

      if (!pet) {
        return next();
      }
      res.json(pet.images.map(({ url }) => url));
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
