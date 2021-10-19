"use strict";
let router = require("express").Router();
const Pet = require("../models/pet-model");
const Order = require("../models/order-model");
const Accesorie = require("../models/accesorie-model");
const { check } = require("express-validator");
const { validateResults } = require("../helpers/validators");

//TODO: Hacer q las ordenes eliminadas expiren luego de 24h

router.get(
  "/",
  (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.redirect("/users/login");
    }
    return next();
  },
  async (req, res, next) => {
    try {
      const mascotas = await Order.find({
        user: req.user.id,
        type: "pet",
      })
        .populate("pet")
        .exec();

      const accesorios = await Order.find({
        user: req.user.id,
        type: "accesorie",
      })
        .populate("accesorie")
        .exec();

      return res.render("ordenes", { accesorios, mascotas });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/mascotas",
  [
    check("cnt", "La cantidad no debe estar vacía").notEmpty(),
    check("id", "").isMongoId(),
  ],
  async (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ msg: "unauthorized" });
    }
    try {
      const errors = validateResults(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ msg: "El id o la cantidad son incorrectos" });
      }
      const { id, cnt } = req.body;

      let pet = await Pet.findById(id).exec();

      if (!pet) {
        return res.status(404).json({ msg: "invalid id" });
      }
      if (pet.status != "available") {
        return res.status(404).json({ msg: "unavailable" });
      }

      let user = req.user;

      if (pet.cnt < cnt) {
        return res.status(400).json({ msg: "No disponemos de esa cantidad" });
      }

      const newOrder = new Order({
        type: "pet",
        pet: id,
        user: user.id,
        cnt,
        price: cnt * pet.price,
      });

      pet.cnt -= cnt;
      pet.stagedCnt += cnt;

      user.orders++;
      user.messages.push({ msg: "Nueva orden añadida" });
      user.newMessages++;

      if (pet.cnt === 0) {
        pet.status = "unavailable";
      }

      await newOrder.save();
      await user.save();
      await pet.save({ validateModifiedOnly: true });

      // let info = { id: pet._id, cnt: pet.cnt };
      // redisClient.publish("product", JSON.stringify(info));
      return res.end();
      // res.redirect("/mascotas");
    } catch (err) {
      console.error(err);
    }
  }
);

router.post(
  "/accesorios",
  [
    check("cnt", "La cantidad no debe estar vacía").notEmpty(),
    check("id", "").isMongoId(),
  ],
  async (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ msg: "unauthorized" });
    }
    try {
      const errors = validateResults(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ msg: "El id o la cantidad son incorrectos" });
      }
      const { id, cnt } = req.body;

      let accesorie = await Accesorie.findById(id).exec();

      if (!accesorie) {
        return res.status(404).json({ msg: "invalid id" });
      }

      if (accesorie.status != "available") {
        return res.status(404).json({ msg: "unavailable" });
      }

      let user = req.user;

      if (accesorie.cnt < cnt) {
        return res.status(400).json({ msg: "No tenemos esa cantidad" });
      }

      const newOrder = new Order({
        type: "accesorie",
        accesorie: id,
        user: user.id,
        cnt,
        price: cnt * accesorie.price,
      });

      accesorie.cnt -= cnt;
      accesorie.stagedCnt += cnt;

      user.orders++;
      user.messages.push({ msg: "Nueva orden añadida" });
      user.newMessages++;

      if (accesorie.cnt === 0) {
        accesorie.status = "unavailable";
      }

      await user.save();
      await newOrder.save();
      await accesorie.save({ validateModifiedOnly: true });

      // let info = { id: accesorie._id, cnt: accesorie.cnt };
      // redisClient.publish("product", JSON.stringify(info));

      return res.end();
    } catch (err) {
      console.error(err);
    }
  }
);

router.route("/:id").delete(async (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).end();
  }
  try {
    let order = await Order.findById(req.params.id).exec();

    if (!order) {
      return res.status(404).json({ msg: "La orden no existe" });
    }

    let user = req.user;

    if (user.id != order.user) {
      return res.status(403).end();
    }

    if (order.state !== "pendient") {
      return res.status(400).json({
        msg: "Solo puede cancelar ordenes pendientes",
      });
    }

    let article =
      order.type == "pet"
        ? await Pet.findById(order.pet)
        : await Accesorie.findById(order.accesorie);

    article.cnt += order.cnt;
    article.stagedCnt -= order.cnt;

    if (article.cnt > 0) {
      article.status = "available";
    }

    if (user.orders > 0) user.orders--;
    await order.remove();
    await article.save({ validateModifiedOnly: true });
    await user.save();

    res.end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
