"use strict";
let router = require("express").Router();
let fs = require("fs/promises");
let multer = require("multer");
const upload = multer({ dest: "./uploads/" });
let Pet = require("../../models/pet-model");
const { check } = require("express-validator");
const { validateResults, imageUploaded } = require("../../helpers/validators");
const { deleteFiles } = require("../../helpers/file-helper");

//TODO:Hacer pruebas sobre updatear campos no vacios con valores null "" o undefined
//TODO:Modificar multer para que los archivos se suban directamente el el directorio que deberia ir junto con el id unico de mongo
//TODO:Cambiar multer para que los nombres de las imagenes sea un uuid/4 unico

router
  .route("/")
  .get(async (req, res, next) => {
    try {
      const mascotas = await Pet.find({}).exec();
      res.render("index-mascotas", {
        mascotas,
        seccion: "de mascotas",
      });
    } catch (err) {
      next(err);
    }
  })
  .post(
    upload.array("images"),
    (err, req, res, next) => {
      return res.status(400).end();
    },
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

        let newPet = new Pet(data);

        const images = req.files;

        await newPet.addImages(images, "mascotas");
        await newPet.save();

        res.redirect("/admin/mascotas/");
      } catch (err) {
        console.error(err);
        res.redirect("/admin/mascotas/new");
      }
    }
  );

router.get("/new", (req, res, next) => {
  res.render("new-pet", { seccion: "de mascotas" });
});

router
  .route("/:id")
  .get(check("id").isMongoId(), async (req, res, next) => {
    const errors = validateResults(req);

    if (!errors.isEmpty()) {
      return next();
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
    upload.array("images"),
    (err, req, res, next) => {
      return res.status(400).end();
    },
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

        const images = req.files;

        let pet = await Pet.findById(id).exec();

        if (!pet) {
          return next();
        }

        await pet.addImages(images, "mascotas");

        await pet.updateOne({ ...data, images: pet.images }).exec();

        res.redirect("/admin/mascotas/");
      } catch (err) {
        next(err);
      }
    }
  )
  .delete((req, res, next) => {
    const id = req.params.id;
    //TODO:Eliminar las mascotas
    // let pet = petModel.findById(id);
    // const images = pet.images
    //   petModel
    //     .findOneAndDelete({ _id: req.params.id })
    //     .catch((err) => console.error(err))
    //     .then(() => res.redirect("/admin/mascotas/"));
  });

router.route("/:id/image/:imgId/").delete(async (req, res, next) => {
  try {
    const { id, imgId } = req.params;

    const pet = await Pet.findById(id).exec();

    if (!pet) {
      return next();
    }

    const img = pet.images.id(imgId);

    if (!img) {
      return next();
    }

    img.remove();

    await fs.unlink(`.${img.url}`);

    await pet.save();

    res.end();
  } catch (err) {
    console.log(err);
  }
});

router.route("/:id/images/").delete(async (req, res, next) => {
  try {
    const id = req.params.id;

    const pet = await Pet.findById(id).exec();

    if (!pet) {
      console.info("pet does not exist");
      return next();
    }

    let arr = pet.images.map(({ url }) => `./${url}`);

    await deleteFiles(arr);
    pet.images = [];
    await pet.save();
    res.end();
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
