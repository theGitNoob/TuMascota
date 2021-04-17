"@use-strict";
let express = require("express");
let adminModel = require("./models/admin-user.js").adminModel;
let router = express.Router();
let petModel = require("./models/pet").petModel;
let accesoriesModel = require("./models/accesories").accesoriesModel;
let formidable = require("formidable");
let fs = require("fs/promises");
let mongoose = require("mongoose");

router.get("/", (req, res) => {
  res.render("admin");
});

router
  .route("/login")
  .get((req, res) => {
    adminModel.countDocuments({}, (err, count) => {
      if (err) {
        console.error(err);
        res.redirect("/admin/login");
      } else {
        if (!count) {
          res.redirect("/admin/new");
        } else {
          res.render("login", { ruta: req.path });
        }
      }
    });
  })
  .post((req, res) => {
    adminModel.countDocuments({}, (err, count) => {
      if (err) {
        console.error(err);
        res.redirect("/admin/login");
      } else {
        if (!count) {
          res.redirect("/admin/new");
        } else {
          let data = {
            username: req.body.username,
            password: req.body.password,
          };
          adminModel.findOne(data, (err, doc) => {
            if (err) {
              console.error(err);
            } else {
              if (doc != null) {
                req.session.user_id = doc._id;
                req.session.cookie.maxAge = 1800000;
                res.redirect("/admin");
              } else {
                res.redirect("/admin/login");
              }
            }
          });
        }
      }
    });
  });
router
  .route("/new")
  .get((req, res) => {
    adminModel.countDocuments({}, (err, count) => {
      if (err) {
        console.error(err);
        res.redirect("/admin/new");
      } else {
        if (count) {
          res.redirect("/admin/login");
        } else {
          res.render("register");
        }
      }
    });
  })
  .post((req, res) => {
    adminModel.countDocuments({}, (err, count) => {
      if (err) {
        console.error(err);
        res.redirect("/admin/new");
      } else {
        if (count) {
          res.redirect("/admin/login");
        } else {
          //validate new user

          let data = {
            username: req.body.username,
            password: req.body.password,
            password_confirmation: req.body.password_confirmation,
          };

          let newAdminUser = new adminModel(data);

          newAdminUser.save((err) => {
            if (err) {
              console.err(err);
              res.redirect("/admin/new");
            }
            res.end();
          });
        }
      }
    });
  });

//Rutas relacionadas a la seccion de mascotas

router
  .route("/mascotas")
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
  .post((req, res) => {
    console.log("POST");
    const form = formidable({ uploadDir: "./temp", keepExtensions: true });
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error(err);
      } else {
        let fileName = files.file.path;
        let wasFileSend = files.file.size != 0;
        let data = {
          type: fields.animal_type,
          age: fields.age,
          price: fields.price,
          ownerPhone: fields.owner_phone,
          ownerName: fields.owner_name,
          breed: fields.breed,
          ownerAccount: fields.owner_account,
        };

        if (wasFileSend) {
          data.imgExtension = fileName.substring(fileName.lastIndexOf(".") + 1);
        }

        let newPet = new petModel(data);
        let newFileName = `./public/img/mascotas/${newPet._id}.${data.imgExtension}`;
        newPet
          .save()
          .then(() => {
            if (wasFileSend) {
              fs.rename(fileName, newFileName).catch((err) => {
                throw err;
              });
            }
          })
          .then(() => res.redirect("/admin/mascotas/"))
          .catch((err) => {
            console.error(err);
            res.redirect("/admin/mascotas/new");
          });
      }
    });
  });

router.get("/mascotas/new", (req, res) => {
  res.render("new-pet", { seccion: "de mascotas" });
});

router
  .route("/mascotas/:id")
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
  .put((req, res) => {
    const form = formidable({ uploadDir: "./temp", keepExtensions: true });
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error(err);
        res.redirect(`/admin/mascotas/${req.params.id}`);
        return;
      } else {
        let wasFileSend = files.file.size != 0;
        let fileName = files.file.path;

        let data = {
          type: fields.animal_type,
          age: fields.age,
          price: fields.price,
          ownerPhone: fields.owner_phone,
          ownerName: fields.owner_name,
          breed: fields.breed,
          ownerAccount: fields.owner_account,
        };

        if (wasFileSend) {
          let extension = fileName.substring(fileName.lastIndexOf(".") + 1);
          data.imgExtension = extension;
        }
        petModel
          .findOneAndUpdate({ _id: req.params.id }, data, {
            useFindAndModify: false,
            runValidators: true,
          })
          .then((doc) => {
            if (wasFileSend) {
              fs.rename(
                fileName,
                `./public/img/mascotas/${doc._id}.${data.imgExtension}`
              )
                .then(() => {
                  if (
                    doc.imgExtension != undefined &&
                    doc.imgExtension != data.imgExtension
                  ) {
                    fs.unlink(
                      `./public/img/mascotas/${doc._id}.${doc.imgExtension}`
                    ).catch((err) => {
                      if (err.code != "ENOENT") {
                        throw err;
                      }
                    });
                  }
                })
                .catch((err) => {
                  if (err.code != "ENOENT") {
                    throw err;
                  }
                });
            }
          })
          .then(() => {
            res.redirect("/admin/mascotas/");
          })
          .catch((err) => {
            console.error(err);
            res.redirect(`/admin/mascotas/${req.params.id}`);
          });
      }
    });
  })
  .delete((req, res) => {
    petModel
      .findOneAndDelete({ _id: req.params.id })
      .catch((err) => console.error(err))
      .then(() => res.redirect("/admin/mascotas/"));
  });

router
  .route("/accesorios")
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
  .post((req, res) => {
    const form = formidable({ uploadDir: "./temp", keepExtensions: true });
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error(err);
        res.redirect("/admin/accesorios/new");
      } else {
        let fileName = files.file.path;
        let wasFileSend = files.file.size != 0;

        let data = {
          type: fields.type,
          price: fields.price,
          ownerPhone: fields.owner_phone,
          ownerName: fields.owner_name,
          ownerAccount: fields.owner_account,
          cnt: fields.cnt ? fields.cnt : 1,
        };

        if (wasFileSend) {
          let extension = fileName.substring(fileName.lastIndexOf(".") + 1);
          data.imgExtension = extension;
        }
        let newAccesorie = new accesoriesModel(data);
        let newFileName = `./public/img/accesorios/${newAccesorie._id}.${newAccesorie.imgExtension}`;
        newAccesorie
          .save()
          .then(() => {
            if (wasFileSend) {
              fs.rename(fileName, newFileName).catch((err) => {
                throw err;
              });
            }
          })
          .then(() => res.redirect("/admin/accesorios/"))
          .catch((err) => {
            console.error(err);
            res.redirect("/admin/accesorios/new");
          });
      }
    });
  });

router.get("/accesorios/new", (req, res) => {
  res.render("new-accesorie", { seccion: "de accesorios" });
});

router
  .route("/accesorios/:id")
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
  .put((req, res) => {
    const form = formidable({ uploadDir: "./temp", keepExtensions: true });
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error(err);
        res.redirect(`/admin/accesorios/${req.params.id}`);
      } else {
        let fileName = files.file.path;
        let wasFileSend = files.file.size != 0;

        let data = {
          type: fields.type,
          price: fields.price,
          ownerPhone: fields.owner_phone,
          ownerName: fields.owner_name,
          ownerAccount: fields.owner_account,
          cnt: fields.cnt ? fields.cnt : 1,
        };

        if (wasFileSend) {
          let extension = fileName.substring(fileName.lastIndexOf(".") + 1);
          data.imgExtension = extension;
        }

        accesoriesModel
          .findOneAndUpdate({ _id: req.params.id }, data, {
            useFindAndModify: false,
            runValidators: true,
          })
          .then((doc) => {
            if (wasFileSend) {
              fs.rename(
                fileName,
                `./public/img/accesorios/${doc._id}.${data.imgExtension}`
              )
                .then(() => {
                  if (
                    doc.imgExtension != undefined &&
                    doc.imgExtension != data.imgExtension
                  ) {
                    fs.unlink(
                      `./public/img/accesorios/${doc._id}.${doc.imgExtension}`
                    ).catch((err) => {
                      if (err.code != "ENOENT") {
                        throw err;
                      }
                    });
                  }
                })
                .catch((err) => {
                  if (err.code != "ENOENT") {
                    throw err;
                  }
                });
            }
          })
          .then(() => {
            res.redirect("/admin/accesorios/");
          })
          .catch((err) => {
            console.error(err);
            res.redirect(`/admin/accesorios/${req.params.id}`);
          });
      }
    });
  })
  .delete((req, res) => {
    accesoriesModel
      .findOneAndDelete({ _id: req.params.id })
      .catch((err) => console.error(err))
      .then(() => res.redirect("/admin/accesorios/"));
  });

module.exports = router;
