"@use-strict";
let express = require("express");
let adminModel = require("./models/admin-user.js").adminModel;
let router = express.Router();
let petModel = require("./models/pet").petModel;
let accesoriesModel = require("./models/accesorie").accesoriesModel;
let formidable = require("formidable");
let fs = require("fs/promises");
let mongoose = require("mongoose");
let userModel = require("./models/user").userModel;
let orderModel = require("./models/order").orderModel;

router.get("/", (req, res) => {
  res.render("admin");
});

router
  .route("/login")
  .get((req, res) => {
    adminModel
      .countDocuments({})
      .then((count) => {
        if (!count) res.redirect("/admin/new");
        res.render("admin-login", { ruta: req.path });
      })
      .catch((err) => {
        console.error(err);
        res.redirect("/admin/new");
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
          res.render("admin-register");
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
          type: fields.animal_type.toLowerCase(),
          breed: fields.breed ? fields.breed : undefined,
          sex: fields.sex ? fields.sex : undefined,
          price: fields.price,
          cnt: fields.cnt ? fields.cnt : undefined,
          birthDay: fields.birth_day ? fields.birth_day : undefined,
          description: fields.description ? fields.description : undefined,
          ownerPhone: fields.owner_phone,
          ownerName: fields.owner_name,
          ownerAccount: fields.owner_account ? fields.owner_account : undefined,
        };

        if (wasFileSend) {
          data.imgExtension = fileName.substring(fileName.lastIndexOf(".") + 1);
        }

        let newPet = new petModel(data);
        let newFileName = `./public/img/mascotas/${newPet._id}.${data.imgExtension}`;
        newPet
          .save()
          .then(() => {
            if (wasFileSend) return fs.rename(fileName, newFileName);
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
          type: fields.animal_type.toLowerCase(),
          breed: fields.breed ? fields.breed : undefined,
          sex: fields.sex ? fields.sex : undefined,
          price: fields.price,
          cnt: fields.cnt ? fields.cnt : undefined,
          birthDay: fields.birth_day ? fields.birth_day : undefined,
          description: fields.description ? fields.description : undefined,
          ownerPhone: fields.owner_phone,
          ownerName: fields.owner_name,
          ownerAccount: fields.owner_account ? fields.owner_account : undefined,
          available: fields.cnt != undefined && fields.cnt != 0 ? true : false,
        };

        if (wasFileSend) {
          let extension = fileName.substring(fileName.lastIndexOf(".") + 1);
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
          type: fields.type.toLowerCase(),
          price: fields.price,
          description: fields.description ? fields.description : undefined,
          ownerPhone: fields.owner_phone,
          ownerName: fields.owner_name,
          ownerAccount: fields.owner_account ? fields.owner_account : undefined,
          cnt: fields.cnt ? fields.cnt : undefined,
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
            if (wasFileSend) return fs.rename(fileName, newFileName);
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
          type: fields.type.toLowerCase(),
          price: fields.price,
          description: fields.description ? fields.description : undefined,
          ownerPhone: fields.owner_phone,
          ownerName: fields.owner_name,
          ownerAccount: fields.owner_account ? fields.owner_account : undefined,
          cnt: fields.cnt ? fields.cnt : undefined,
          available: fields.cnt != undefined && fields.cnt != 0 ? true : false,
        };

        if (wasFileSend) {
          let extension = fileName.substring(fileName.lastIndexOf(".") + 1);
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
      }
    });
  })
  .delete((req, res) => {
    accesoriesModel
      .findOneAndDelete({ _id: req.params.id })
      .catch((err) => console.error(err))
      .then(() => res.redirect("/admin/accesorios/"));
  });

router.get("/ordenes", async (req, res) => {
  try {
    let orders = await orderModel.find().populate("owner");
    res.render("index-ordenes", { ordenes: orders });
  } catch (err) {
    console.error(err);
  }
});

router
  .route("/ordenes/:id")
  .get(async (req, res) => {})
  .put(async (req, res) => {
    try {
      let order = await orderModel.findById(req.params.id);
      let article =
        order.articleType == "mascota"
          ? await petModel.findById(order.articleId)
          : await accesoriesModel.findById(order.articleId);
      article.stagedCnt -= order.cnt;

      //Actualizar el modelo de productos vendidos

      await order.deleteOne();
      if (article.cnt == 0 && article.stagedCnt == 0) {
        await article.remove();
        console.log("was deleted");
      }
      res.send("Vendido");
    } catch (error) {}
  })
  .delete(async (req, res) => {
    try {
      let order = await orderModel.findById(req.params.id);
      let article =
        order.articleType == "mascota"
          ? await petModel.findById(order.articleId)
          : await accesoriesModel.findById(order.articleId);

      article.cnt += order.cnt;
      article.stagedCnt -= order.cnt;
      article.available = article.cnt === 0 ? false : true;

      await article.save({ validateModifiedOnly: true });
      await order.deleteOne();

      res.redirect("/admin/ordenes");
    } catch (err) {
      console.error(err);
    }
  });
module.exports = router;
