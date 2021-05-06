"@use-strict";
let router = require("express").Router();
let petModel = require("../../models/pet").petModel;
let fs = require("fs/promises");
let mongoose = require("mongoose");
let multer = require("multer");
var upload = multer({ dest: "./uploads/" });

router
  .route("/")
  .get((req, res) => {
    petModel
      .find({})
      .then((mascotas) =>
        res.render("index-mascotas", {
          mascotas: mascotas,
          seccion: "de mascotas",
        })
      )
      .catch((err) => res.json(err));
  })
  .post(upload.single("file"), (req, res) => {
    let wasFileSend = req.file !== undefined;
    let fileName = wasFileSend ? req.file.path : undefined;
    console.log(req.file);

    let data = {
      type: req.body.animal_type.toLowerCase(),
      breed: req.body.breed ? req.body.breed : undefined,
      sex: req.body.sex ? req.body.sex : undefined,
      price: req.body.price,
      cnt: req.body.cnt ? req.body.cnt : undefined,
      birthDay: req.body.birth_day ? req.body.birth_day : undefined,
      description: req.body.description ? req.body.description : undefined,
      ownerPhone: req.body.owner_phone,
      ownerName: req.body.owner_name,
      ownerAccount: req.body.owner_account ? req.body.owner_account : undefined,
    };

    if (wasFileSend) {
      data.imgExtension = data.imgExtension = req.file.originalname.substring(
        req.file.originalname.lastIndexOf(".") + 1
      );
    }

    let newPet = new petModel(data);
    let newFileName = `./public/img/mascotas/${newPet._id}.${data.imgExtension}`;
    newPet
      .save()
      .then(() => {
        if (wasFileSend) return fs.rename(req.file.path, newFileName);
      })
      .then(() => res.redirect("/admin/mascotas/"))
      .catch((err) => {
        console.error(err);
        res.redirect("/admin/mascotas/new");
      });
  });

router.get("/new", (req, res) => {
  res.render("new-pet", { seccion: "de mascotas" });
});

router
  .route("/:id")
  .get((req, res) => {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      petModel
        .findById(req.params.id)
        .then((doc) => {
          if (doc === null) throw null;
          res.render("show-pet", { mascota: doc, seccion: "de mascotas" });
        })
        .catch((err) => {
          if (err === null)
            res.send("La página q esta intentando acceder no existe");
          else {
            console.error(err);
            res.redirect("/admin/mascotas");
          }
        });
    } else {
      res.send("La página q esta intentando acceder no existe");
    }
  })
  .put(upload.single("file"), (req, res) => {
    let wasFileSend = req.file !== undefined;
    let fileName = wasFileSend ? req.file.path : undefined;

    let data = {
      type: req.body.animal_type.toLowerCase(),
      breed: req.body.breed ? req.body.breed : undefined,
      sex: req.body.sex ? req.body.sex : undefined,
      price: req.body.price,
      cnt: req.body.cnt ? req.body.cnt : undefined,
      birthDay: req.body.birth_day ? req.body.birth_day : undefined,
      description: req.body.description ? req.body.description : undefined,
      ownerPhone: req.body.owner_phone,
      ownerName: req.body.owner_name,
      ownerAccount: req.body.owner_account ? req.body.owner_account : undefined,
      available: req.body.cnt != undefined && req.body.cnt != 0 ? true : false,
    };

    if (wasFileSend) {
      let extension = (data.imgExtension = req.file.originalname.substring(
        req.file.originalname.lastIndexOf(".") + 1
      ));
      data.imgExtension = extension;
    }

    petModel
      .findByIdAndUpdate(req.params.id, data, {
        useFindAndModify: false,
        runValidators: true,
      })
      .then(async (doc) => {
        if (wasFileSend) {
          try {
            await fs.rename(
              fileName,
              `./public/img/mascotas/${doc._id}.${data.imgExtension}`
            );
            if (
              doc.imgExtension != undefined &&
              doc.imgExtension != data.imgExtension
            ) {
              await fs.unlink(
                `./public/img/mascotas/${doc._id}.${doc.imgExtension}`
              );
            }
          } catch (err) {
            if (err.code != "ENOENT") throw err;
          }
        }
      })
      .then(() => {
        res.redirect("/admin/mascotas/");
      })
      .catch((err) => {
        console.error(err);
        res.redirect(`/admin/mascotas/${req.params.id}`);
      });
  })
  .delete((req, res) => {
    petModel
      .findOneAndDelete({ _id: req.params.id })
      .catch((err) => console.error(err))
      .then(() => res.redirect("/admin/mascotas/"));
  });

module.exports = router;
