"@use-strict";
let express = require("express");
let adminModel = require("./models/admin-user.js").adminModel;
let router = express.Router();
let petModel = require("./models/pet").petModel;
let accesoriesModel = require("./models/accesories").accesoriesModel;
let formidable = require("formidable");
let fs = require("fs");
let mongoose = require("mongoose");
// Rutas relacionadas a la creacion e inicio de un admin

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
    petModel.find({}, (err, mascotas) => {
      if (err) {
        console.error(err);
        res.redirect("/admin");
      } else {
        res.render("index-mascotas", {
          ruta: req.url,
          mascotas: mascotas,
          seccion: "de mascotas",
        });
      }
    });
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
          let extension = fileName.substring(fileName.lastIndexOf(".") + 1);
          data.imgExtension = extension;
        }

        let newPet = new petModel(data);
        newPet.save((err) => {
          if (err) {
            console.error(err);
            res.redirect("/admin/mascotas/new");
          } else {
            if (wasFileSend) {
              fs.rename(
                fileName,
                `./public/img/pets/${newPet._id}.${data.imgExtension}`,
                (err) => {
                  if (err) {
                    console.error(err);
                  }
                  res.redirect(`/admin/mascotas/${newPet._id}`);
                }
              );
            } else {
              res.redirect(`/admin/mascotas/${newPet._id}`);
            }
          }
        });
      }
    });
  });

router.get("/mascotas/new", (req, res) => {
  res.render("new-pet", { seccion: "de mascotas" });
});

router
  .route("/mascotas/:id")
  .get((req, res, next) => {
    // if (mongoose.Types.ObjectId.isValid(req.params.id))
    petModel.findById(req.params.id, (err, doc) => {
      if (err) {
        // console.error(err);
        next(err);
        // res.redirect("/admin/mascotas");
      } else {
        res.render("show-pet", { mascota: doc, seccion: "de mascotas" });
      }
    });
    // else {
    //   next();
    // }
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
        console.log(data);
        petModel.findOneAndUpdate(
          { _id: req.params.id },
          data,
          { useFindAndModify: false, runValidators: true },
          (err, doc) => {
            if (err) {
              console.error(err);
              res.redirect(`/admin/mascotas/${req.params.id}`);
            } else {
              if (wasFileSend) {
                console.log("put");
                fs.rename(
                  fileName,
                  `./public/img/pets/${doc._id}.${data.imgExtension}`,
                  (err) => {
                    if (err) {
                      console.error(err);
                      res.redirect(`/admin/mascotas/${req.params.id}`);
                    } else {
                      if (doc.imgExtension != undefined) {
                        console.log(
                          `./public/img/pets/${doc._id}.${doc.imgExtension}`
                        );
                        fs.unlink(
                          `./public/img/pets/${doc._id}.${doc.imgExtension}`,
                          (err) => {
                            if (err && err.code != "ENOENT") {
                              console.error(err);
                              res.redirect(`/admin/mascotas/${req.params.id}`);
                            } else {
                              res.redirect("/admin/mascotas/");
                            }
                          }
                        );
                      } else {
                        res.redirect("/admin/mascotas/");
                      }
                    }
                  }
                );
              } else {
                res.redirect("/admin/mascotas/");
              }
            }
          }
        );
      }
    });
  })
  .delete((req, res) => {
    petModel.findOneAndDelete({ _id: req.params.id }, (err, doc) => {
      if (err) {
        console.error(err);
        res.redirect("/admin/macotas");
      } else {
        fs.unlink(
          `./public/img/pets/${req.params.id}.${doc.imgExtension}`,
          (err) => {
            if (err && err.code != "ENOENT") {
              console.error(err);
            }
            res.redirect("/admin/mascotas");
          }
        );
      }
    });
  });

router
  .route("/accesorios")
  .get((req, res) => {
    accesoriesModel.find({}, (err, docs) => {
      res.render("index-accesorios", {
        accesorios: docs,
        seccion: "de accesorios",
      });
    });
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
        newAccesorie.save((err) => {
          if (err) {
            console.error(err);
            res.redirect("/admin/accesorios/new");
          } else {
            if (wasFileSend) {
              fs.rename(
                fileName,
                `./public/img/accesories/${newAccesorie._id}.${newAccesorie.imgExtension}`,
                (err) => {
                  if (err) {
                    console.error(err);
                    res.redirect("/admin/accesorios/new");
                  } else {
                    res.redirect(`/admin/accesorios/${newAccesorie._id}`);
                  }
                }
              );
            } else {
              res.redirect(`/admin/accesorios/${newAccesorie._id}`);
            }
          }
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
    accesoriesModel.findOne({ _id: req.params.id }, (err, doc) => {
      if (err) {
        console.error();
        res.redirect("/admin/accesorios");
      } else {
        res.render("show-accesorie", {
          accesorio: doc,
          seccion: "de accesorios",
        });
      }
    });
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

        accesoriesModel.findOneAndUpdate(
          { _id: req.params.id },
          data,
          { useFindAndModify: false, runValidators: true },
          (err, doc) => {
            if (err) {
              console.error(err);
              res.redirect(`/admin/accesorios/${req.params._id}`);
            } else {
              console.log(doc);
              if (wasFileSend) {
                fs.rename(
                  fileName,
                  `./public/img/accesories/${req.params.id}.${data.imgExtension}`,
                  (err) => {
                    if (err) {
                      console.error(err);
                      res.redirect(`/admin/accesorios/${req.params.id}`);
                    } else {
                      if (doc.imgExtension != undefined) {
                        fs.unlink(
                          `./public/img/accesories/${doc._id}.${doc.imgExtension}`,
                          (err) => {
                            if (err && err.code != "ENOENT") {
                              console.error(err);
                              res.redirect(`/admin/accesorios/${doc._id}`);
                            } else {
                              res.redirect("/admin/accesorios/");
                            }
                          }
                        );
                      } else {
                        res.redirect("/admin/accesorios/");
                      }
                    }
                  }
                );
              } else {
                res.redirect("/admin/accesorios/");
              }
            }
          }
        );
      }
    });
  })
  .delete((req, res) => {
    accesoriesModel.findOneAndDelete({ _id: req.params.id }, (err, doc) => {
      if (err) {
        console.error(err);
        res.redirect("/admin/accesorios/");
      } else {
        fs.unlink(
          `./public/img/accesories/${req.params.id}.${doc.imgExtension}`,
          (err) => {
            if (err && err.code != "ENOENT") {
              console.error(err);
            }
            res.redirect("/admin/accesorios");
          }
        );
      }
    });
  });
module.exports = router;
