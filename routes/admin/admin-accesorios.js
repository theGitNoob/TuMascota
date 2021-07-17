"use strict";
let router = require("express").Router();
let fs = require("fs/promises");
let mongoose = require("mongoose");
let multer = require("multer");
var upload = multer({ dest: "./uploads/" });
let accesoriesModel = require("../../models/accesorie").accesoriesModel;

router
  .route("/")
  .get((req, res) => {
    accesoriesModel
      .find({})
      .then((accesorios) =>
        res.render("index-accesorios", {
          accesorios: accesorios,
          seccion: "de accesorios",
        })
      )
      .catch((err) => res.json(err));
  })
  .post(upload.single("file"), (req, res) => {
    let wasFileSend = req.file !== undefined;
    let fileName = wasFileSend ? req.file.path : undefined;

    let data = {
      type: req.body.type.toLowerCase(),
      price: req.body.price,
      description: req.body.description ? req.body.description : undefined,
      ownerPhone: req.body.owner_phone,
      ownerName: req.body.owner_name,
      ownerAccount: req.body.owner_account ? req.body.owner_account : undefined,
      cnt: req.body.cnt ? req.body.cnt : undefined,
      added: new Date().getTime(),
    };

    if (wasFileSend) {
      let extension = (data.imgExtension = req.file.originalname.substring(
        req.file.originalname.lastIndexOf(".") + 1
      ));
      data.imgExtension = extension;
    }
    let newAccesorie = new accesoriesModel(data);
    let newFileName = `./public/img/accesorios/${newAccesorie._id}.${newAccesorie.imgExtension}`;
    newAccesorie
      .save()
      .then(() => {
        if (wasFileSend) return fs.rename(fileName, newFileName);
      })
      .then(() => res.redirect("/admin/accesorios/"))
      .catch((err) => {
        console.error(err);
        res.redirect("/admin/accesorios/new");
      });
  });

router.get("/new", (req, res) => {
  res.render("new-accesorie", { seccion: "de accesorios" });
});

router
  .route("/:id")
  .get((req, res) => {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      accesoriesModel
        .findById(req.params.id)
        .then((doc) => {
          if (doc === null) throw null;

          res.render("show-accesorie", {
            accesorio: doc,
            seccion: "de accesorios",
          });
        })
        .catch((err) => {
          if (err === null)
            res.send("La página q esta intentando acceder no existe");
          else {
            console.error(err);
            res.redirect("/admin/accesorios");
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
      type: req.body.type.toLowerCase(),
      price: req.body.price,
      description: req.body.description ? req.body.description : undefined,
      ownerPhone: req.body.owner_phone,
      ownerName: req.body.owner_name,
      ownerAccount: req.body.owner_account ? req.body.owner_account : undefined,
      cnt: req.body.cnt ? req.body.cnt : undefined,
      available: req.body.cnt != undefined && req.body.cnt != 0 ? true : false,
    };

    if (wasFileSend) {
      let extension = (data.imgExtension = req.file.originalname.substring(
        req.file.originalname.lastIndexOf(".") + 1
      ));
      data.imgExtension = extension;
    }

    accesoriesModel
      .findByIdAndUpdate(req.params.id, data, {
        useFindAndModify: false,
        runValidators: true,
      })
      .then(async (doc) => {
        if (wasFileSend) {
          try {
            console.log(fileName);
            await fs.rename(
              fileName,
              `./public/img/accesorios/${doc._id}.${data.imgExtension}`
            );
            if (
              doc.imgExtension != undefined &&
              doc.imgExtension != data.imgExtension
            ) {
              await fs.unlink(
                `./public/img/accesorios/${doc._id}.${doc.imgExtension}`
              );
            }
          } catch (err) {
            if (err.code != "ENOENT") throw err;
          }
        }
      })
      .then(() => {
        res.redirect("/admin/accesorios/");
      })
      .catch((err) => {
        console.error(err);
        res.redirect(`/admin/accesorios/${req.params.id}`);
      });
  })
  .delete((req, res) => {
    accesoriesModel
      .findOneAndDelete({ _id: req.params.id })
      .catch((err) => console.error(err))
      .then(() => res.redirect("/admin/accesorios/"));
  });

module.exports = router;
