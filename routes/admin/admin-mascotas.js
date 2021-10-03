"use strict";
let router = require("express").Router();
let fs = require("fs/promises");
let multer = require("multer");
const upload = multer({ dest: "./uploads/" });
let Pet = require("../../models/pet-model");
const { check } = require("express-validator");
const { validateResults, imageUploaded } = require("../../helpers/validators");
const { deleteFiles } = require("../../helpers/file-helper");
const Order = require("../../models/order-model");

//TODO:Hacer pruebas sobre updatear campos no vacios con valores null "" o undefined
//TODO:Modificar multer para que los archivos se suban directamente el el directorio que deberia ir junto con el id unico de mongo
//TODO:Cambiar multer para que los nombres de las imagenes sea un uuid/4 unico

//TODO: Notificar a los usuarios cuando una nueva mascota o accesorios ha sido añadida
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
          console.log(errors.array());
          return res.status(400).json(errors.array());
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

        res.end();
      } catch (error) {
        next(error);
      }
    }
  );

router.get("/new", (req, res, next) => {
  res.render("new-pet", { seccion: "de mascotas" });
});
//TODO:Hacer un middleware en todas las rutas que usen un :id y verificar que sea valido(401) y exista(400)
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
      //TODO:Cambiar la ruta para que acepte un parametro que indique si deseo eliminar las fotos antiguas
      const { id } = req.params;
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
          status: cnt != 0 ? "available" : "unavailable",
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
      return res.status(401).end();
    }

    try {
      let pet = await Pet.findById(id).exec();

      if (!pet) return res.status(404).end();

      const orders = await Order.find({ type: "pet", pet: id })
        .populate("user")
        .exec();

      if (orders) {
        //TODO:Notificar a los usuarios
        for (let order of orders) {
          order.user.orders--;
          await order.user.save();
          await order.remove();
        }
      }

      await pet.deleteImages(pet.images);
      await pet.remove();

      return res.end();
    } catch (error) {
      next(error);
    }
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

    await img.remove();

    await fs.unlink(`.${img.url}`);

    await pet.save();

    return res.end();
  } catch (error) {
    next(error);
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
