let router = require("express").Router();
let Accesorie = require("../models/accesorie-model");
let redis = require("redis");

// let redisClient = redis.createClient();

router.get("/", async (req, res) => {
  try {
    const accesorios = await Accesorie.find({ status: "available" }).exec();
    res.render("accesorios", { accesorios });
  } catch (err) {
    console.error(err);
  }
});

router.get("/:id/images/", async (req, res) => {
  const id = req.params.id;
  const accesorie = await Accesorie.findById(id).exec();
  res.json(accesorie.images);
});

module.exports = router;
