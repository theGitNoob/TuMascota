"use strict";
let router = require("express").Router();
const { check } = require("express-validator");
let fs = require("fs/promises");
let mongoose = require("mongoose");
let multer = require("multer");
const { imageUploaded, validateResults } = require("../../helpers/validators");
const upload = multer({ dest: "./uploads/" });
let Accesorie = require("../../models/accesorie-model");

router
  .route("/")
  .get(async (req, res) => {
    try {
      const accesorios = await Accesorie.find({}).exec();
      res.render("index-accesorios", {
        accesorios,
        seccion: "de accesorios",
      });
    } catch (error) {
      console.error(error);
    }
  })
  .post(
    upload.single("image"),
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
      check("image").custom(imageUploaded),
    ],
    async (req, res) => {
      const errors = validateResults(req);

      if (!errors.isEmpty()) {
        return res.json(errors.array());
      }

      const file = req.file;

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

      const imgExtension = file.originalname.substring(
        file.originalname.lastIndexOf(".") + 1
      );

      let newAccesorie = new Accesorie(data);

      newAccesorie.images = [{}];
      const image = newAccesorie.images[0];
      newAccesorie.images[0].url = `/public/img/accesorios/${image._id}.${imgExtension}`;

      const imgId = newAccesorie.images[0]._id;
      let newFileName = `./public/img/accesorios/${imgId}.${imgExtension}`;

      await fs.rename(file.path, newFileName);
      await newAccesorie.save();

      res.redirect("/admin/accesorios");
    }
  );

router.get("/new", (req, res) => {
  res.render("new-accesorie", { seccion: "de accesorios" });
});

router
  .route("/:id")
  .get(check("id").isMongoId(), async (req, res) => {
    const errors = validateResults(req);

    if (!errors.isEmpty()) {
      return res.redirect("/admin/accesorios");
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
    upload.single("file"),
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
    async (req, res) => {
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

        const file = req.file;
        const pet = await Accesorie.findByIdAndUpdate(id, data).exec();

        if (!pet) {
          return res.redirect("/admin/accesorios");
        }

        if (file) {
          const image = pet.images[0].url;
          await fs.rename(file.path, `.${image}`);
        }

        return res.redirect("/admin/accesorios");
      } catch (error) {}
    }
  )
  .delete((req, res) => {
    //TODO:Eliminar los accesorios
  });

module.exports = router;
