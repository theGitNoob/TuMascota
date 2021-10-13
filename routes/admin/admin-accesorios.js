"use strict";
let router = require("express").Router();
const { check } = require("express-validator");
let fs = require("fs/promises");
let multer = require("multer");
const {
  imageUploaded,
  validateResults,
  isValidPhone,
  isValidName,
} = require("../../helpers/validators");
const upload = multer({ dest: "./uploads/" });
let Accesorie = require("../../models/accesorie-model");
const Order = require("../../models/order-model");

router
  .route("/")
  .get(async (req, res, next) => {
    try {
      const accesorios = await Accesorie.find({}).exec();
      res.render("index-accesorios", {
        accesorios,
        seccion: "de accesorios",
      });
    } catch (err) {
      next(err);
    }
  })
  .post(
    upload.array("images"),
    [
      check("type", "El tipo de accesorio no debe estar vacío").notEmpty(),
      check("price", "El precio no debe estar vacío").notEmpty(),
      check("cnt", "La cantidad debe ser un numero").isNumeric(),
      check("ownerPhone").custom(isValidPhone),
      check("ownerName").custom(isValidName),
      check("images").custom(imageUploaded),
    ],
    async (req, res, next) => {
      try {
        const errors = validateResults(req);

        if (!errors.isEmpty()) {
          return res.status(400).json(errors.array());
        }

        const {
          type,
          price,
          cnt = 1,
          description = undefined,
          ownerPhone,
          ownerName,
          ownerAccount,
        } = req.body;

        let data = {
          type: type.toLowerCase(),
          price,
          description,
          ownerPhone,
          ownerName,
          ownerAccount,
          cnt,
        };

        let newAccesorie = new Accesorie(data);

        const images = req.files;

        await newAccesorie.addImages(images, "accesorios");
        await newAccesorie.save();

        res.end();
      } catch (error) {
        next(error);
      }
    }
  );

router.get("/new", (req, res, next) => {
  res.render("new-accesorie", { seccion: "de accesorios" });
});

router
  .route("/:id")
  .get(check("id").isMongoId(), async (req, res, next) => {
    const errors = validateResults(req);

    if (!errors.isEmpty()) {
      return next();
    }

    const accesorie = await Accesorie.findById(req.params.id).exec();

    if (!accesorie) {
      return res.redirect("/admin/accesorios");
    }

    res.render("show-accesorie", {
      accesorie,
      seccion: "de accesorios",
    });
  })
  .put(
    upload.array("images"),
    [
      check("type", "El tipo de accesorio no debe estar vacío").notEmpty(),
      check("price", "El precio no debe estar vacío").notEmpty(),
      check("cnt", "La cantidad debe ser un numero").isNumeric(),
      check("ownerPhone").custom(isValidPhone),
      check("ownerName").custom(isValidName),
    ],
    async (req, res, next) => {
      const { id } = req.params;

      try {
        const errors = validateResults(req);

        if (!errors.isEmpty()) {
          return res.status(400).json(errors.array());
        }

        const {
          type,
          price,
          cnt = 1,
          description = undefined,
          ownerPhone,
          ownerName,
          ownerAccount,
        } = req.body;

        const data = {
          type: type.toLowerCase(),
          price,
          cnt,
          status: cnt != 0 ? "available" : "unavailable",
          description,
          ownerPhone,
          ownerName,
          ownerAccount,
        };

        const images = req.files;

        let accesorie = await Accesorie.findById(id).exec();

        if (!accesorie) {
          return next();
        }

        await accesorie.addImages(images, "accesorios");

        await accesorie.updateOne({ ...data, images: accesorie.images }).exec();

        return res.end();
      } catch (err) {
        next(err);
      }
    }
  )
  .delete([check("id").isMongoId()], async (req, res, next) => {
    const { id } = req.params;

    const errors = validateResults(req);
    if (!errors.isEmpty()) {
      return res.status(400).end();
    }

    try {
      let accesorie = await Accesorie.findById(id).exec();

      if (!accesorie) return res.status(404).end();

      const orders = await Order.find({ type: "accesorie", accesorie: id })
        .populate("user")
        .exec();

      if (orders) {
        //TODO:Notificar a los usuarios
        for (let order of orders) {
          if (order.user.orders > 0) order.user.orders--;

          order.user.messages.push({
            msg: "Su órden ha sido cancelada porque no disponemos del accesorio solicitado, para más información contáctenos",
          });
          await order.user.save();
          await order.remove();
        }
      }

      await accesorie.deleteImages(accesorie.images);
      await accesorie.remove();

      return res.end();
    } catch (error) {
      next(error);
    }
  });

router.route("/:id/image/:imgId/").delete(async (req, res, next) => {
  try {
    const { id, imgId } = req.params;

    const accesorie = await Accesorie.findById(id).exec();

    if (!accesorie) {
      return next();
    }

    const img = accesorie.images.id(imgId);

    if (!img) {
      return next();
    }

    await img.remove();

    await fs.unlink(`.${img.url}`);

    await accesorie.save();

    return res.end();
  } catch (error) {
    next(error);
  }
});

router.route("/:id/images/").delete(async (req, res, next) => {
  try {
    const id = req.params.id;

    const accesorie = await Accesorie.findById(id).exec();

    if (!accesorie) {
      console.info("accesorie does not exist");
      return next();
    }

    let arr = accesorie.images.map(({ url }) => `./${url}`);

    await deleteFiles(arr);

    accesorie.images = [];

    await accesorie.save();

    res.end();
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
