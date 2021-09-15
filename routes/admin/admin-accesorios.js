"use strict";
let router = require("express").Router();
const { check } = require("express-validator");
let fs = require("fs/promises");
let multer = require("multer");
const { imageUploaded, validateResults } = require("../../helpers/validators");
const upload = multer({ dest: "./uploads/" });
let Accesorie = require("../../models/accesorie-model");

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
      console.error(err);
    }
  })
  .post(
    upload.array("images"),
    (err, req, res, next) => {
      return res.status(400).end();
    },
    [
      check("type", "El tipo de accesorio no debe estar vacío").notEmpty(),
      check("price", "El precio no debe estar vacío").notEmpty(),
      check(
        "ownerPhone",
        "El numero de telefono del dueño no debe estar vacío"
      ).notEmpty(),
      check(
        "ownerName",
        "El nombre del propietario no debe estar vacío"
      ).notEmpty(),
      check("images").custom(imageUploaded),
    ],
    async (req, res, next) => {
      try {
        const errors = validateResults(req);

        if (!errors.isEmpty()) {
          return res.json(errors.array());
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

        res.redirect("/admin/accesorios");
      } catch (err) {
        console.error(err);
        res.redirect("/admin/mascotas/new");
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
    (err, req, res, next) => {
      return res.status(400).end();
    },
    [
      check("type", "El tipo de accesorio no debe estar vacío").notEmpty(),
      check("price", "El precio no debe estar vacío").notEmpty(),
      check(
        "ownerPhone",
        "El numero de telefono del dueño no debe estar vacío"
      ).notEmpty(),
      check(
        "ownerName",
        "El nombre del propietario no debe estar vacío"
      ).notEmpty(),
    ],
    async (req, res, next) => {
      const id = req.params.id;

      try {
        const errors = validateResults(req);

        if (!errors.isEmpty()) {
          return res.json(errors.array());
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
          description,
          ownerPhone,
          ownerName,
          ownerAccount,
        };

        const images = req.file;

        let accesorie = await accesorieModel.findById(id).exec();

        if (!accesorie) {
          return next();
        }

        await accesorie.addImages(images, "accesorios");
        await accesorie.updateOne({ ...data, images: accesorie.images }).exec;
      } catch (err) {
        console.error(err);
        next(err);
      }
    }
  )
  .delete((req, res, next) => {
    //TODO:Eliminar los accesorios
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

    img.remove();

    await accesorie.save();
    await fs.unlink(`.${img.url}`);

    res.end();
  } catch (err) {
    console.log(err);
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
