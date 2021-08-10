"use strict";
let router = require("express").Router();
let fs = require("fs/promises");
let mongoose = require("mongoose");
let multer = require("multer");
const upload = multer({ dest: "./uploads/" });
let Pet = require("../../models/pet-model");
const { check } = require("express-validator");
const { validateResults, imageUploaded } = require("../../helpers/validators");
const { moveFiles } = require("../../helpers/move-files");

//TODO:
//Hacer pruebas sobre updatear campos no vacios con valores null "" o undefined

router
  .route("/")
  .get(async (req, res) => {
    try {
      const mascotas = await Pet.find({}).exec();
      res.render("index-mascotas", {
        mascotas,
        seccion: "de mascotas",
      });
    } catch (error) {
      console.error(error);
    }
  })
  .post(
    upload.single("image"),
    [
      check("type", "El tipo de mascota no debe estar vacío").notEmpty(),
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
      try {
        const errors = validateResults(req);
        if (!errors.isEmpty()) {
          return res.json(errors.array());
        }
        const file = req.file;
        let fileName = file.path;

        const {
          type,
          breed = undefined,
          sex = undefined,
          price,
          cnt = 1,
          birthDay = undefined,
          description = undefined,
          ownerPhone,
          ownerName,
          ownerAccount,
        } = req.body;

        const data = {
          type: type.toLowerCase(),
          breed,
          sex,
          price,
          cnt,
          birthDay,
          description,
          ownerPhone,
          ownerName,
          ownerAccount,
        };

        const imgExtension = file.originalname.substring(
          file.originalname.lastIndexOf(".") + 1
        );

        let newPet = new Pet(data);

        newPet.images = [{}];
        const image = newPet.images[0];
        newPet.images[0].url = `/public/img/mascotas/${image._id}.${imgExtension}`;

        const imgId = newPet.images[0]._id;

        let newFileName = `./public/img/mascotas/${imgId}.${imgExtension}`;

        await fs.rename(file.path, newFileName);
        await newPet.save();
        res.redirect("/admin/mascotas/");
      } catch (error) {
        console.log(error);
        res.redirect("/admin/mascotas/new");
      }
    }
  );

router.get("/new", (req, res) => {
  res.render("new-pet", { seccion: "de mascotas" });
});

router
  .route("/:id")
  .get(check("id").isMongoId(), async (req, res) => {
    const errors = validateResults(req);

    if (!errors.isEmpty()) {
      return res.redirect("/admin/mascotas");
    }

    const pet = await Pet.findById(req.params.id).exec();

    if (!pet) {
      return res.redirect("/admin/mascotas");
    }

    res.render("show-pet", {
      pet,
      seccion: "de mascotas",
    });
  })
  .put(
    upload.single("image"),
    [
      check("type", "El tipo de mascota no debe estar vacío").notEmpty(),
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
          breed = undefined,
          sex = undefined,
          price,
          cnt = 1,
          birthDay = undefined,
          description = undefined,
          ownerPhone,
          ownerName,
          ownerAccount,
        } = req.body;

        const data = {
          type: type.toLowerCase(),
          breed,
          sex,
          price,
          cnt,
          birthDay,
          description,
          ownerPhone,
          ownerName,
          ownerAccount,
        };
        const file = req.file;

        const pet = await Pet.findByIdAndUpdate(id, data).exec();

        if (!pet) {
          res.redirect("/admin/mascotas");
        }

        if (file) {
          const image = pet.images[0].url;
          await fs.rename(file.path, `.${image}`);
        }

        res.redirect("/admin/mascotas/");
      } catch (error) {
        console.log(error);
        res.redirect("/admin/mascotas/new");
      }
    }
  )
  .delete((req, res) => {
    const id = req.params.id;
    //TODO:Eliminar las mascotas
    // let pet = petModel.findById(id);
    // const images = pet.images
    //   petModel
    //     .findOneAndDelete({ _id: req.params.id })
    //     .catch((err) => console.error(err))
    //     .then(() => res.redirect("/admin/mascotas/"));
  });

router
  .route("/:id/images/")
  .all(async (req, res, next) => {
    const id = req.params.id;
    const pet = await Pet.findById(id);
    if (!pet) {
      res.status(404);
      return res.render("404");
    } else next();
  })
  .get(async (req, res) => {
    const id = req.params.id;
    let pet = await Pet.findById(id);
    const images = pet.images;
    res.json(images);
  })
  .post(upload.array("images"), async (req, res) => {
    try {
      const id = req.params.id;
      const images = req.files;
      const pet = await Pet.findById(id);

      const currImages = pet.images.length;
      if (images.length + currImages > 5) {
        return res.status(400).json({
          msg: "Solo pueden haber 5 fotos por mascota elimine alguna",
        });
      }
      let files = [];

      images.forEach((image, idx) => {
        const imgExtension = image.originalname.substring(
          image.originalname.lastIndexOf(".") + 1
        );

        pet.images.push({});

        const currIdx = currImages + idx;
        pet.images[
          currIdx
        ].url = `/public/img/mascotas/${pet.images[currIdx]._id}.${imgExtension}`;
        files.push({
          oldPath: image.path,
          newPath: `.${pet.images[currIdx].url}`,
        });
      });

      await moveFiles(files);

      await pet.save({});

      res.json(pet.images);
    } catch (error) {
      console.log(error);
    }
  });
router.route("/:id/images/:imgId/").delete(async (req, res, next) => {
  try {
    const { id, imgId } = req.params;
    const pet = await Pet.findById(id);
    if (!pet) {
      res.status(404);
      return res.render("404");
    }
    if (pet.images.length <= 1) {
      return res
        .status(400)
        .json({ msg: "Siempre debe haber una foto de la mascota" });
    }

    const img = pet.images.id(imgId);

    if (!img) {
      res.status(404);
      return res.render("404");
    }
    img.remove();
    await fs.unlink(`.${img.url}`);
    await pet.save();
    res.json(pet);
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
});

router.route("/:id/images/").delete(async (req, res, next) => {
  //TODO: Ruta para borrar todas las imagenes menos una
});

module.exports = router;
