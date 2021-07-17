"use strict";
let express = require("express");
let adminModel = require("../../models/admin-user.js").adminModel;

let router = express.Router();
let petRouter = require("./admin-mascotas");
let accesoriesRouter = require("./admin-accesorios");
let ordersRouter = require("./admin-ordenes");

router.get("/", (req, res) => {
  res.render("admin");
});

// router
//   .route("/login")
//   .get((req, res) => {
//     adminModel
//       .countDocuments({})
//       .then((count) => {
//         if (!count) res.redirect("/admin/new");
//         res.render("admin-login", { ruta: req.path });
//       })
//       .catch((err) => {
//         console.error(err);
//         res.redirect("/admin/new");
//       });
//   })
//   .post((req, res) => {
//     adminModel.countDocuments({}, (err, count) => {
//       if (err) {
//         console.error(err);
//         res.redirect("/admin/login");
//       } else {
//         if (!count) {
//           res.redirect("/admin/new");
//         } else {
//           let data = {
//             username: req.body.username,
//             password: req.body.password,
//           };
//           adminModel.findOne(data, (err, doc) => {
//             if (err) {
//               console.error(err);
//             } else {
//               if (doc != null) {
//                 req.session.user_id = doc._id;
//                 req.session.cookie.maxAge = 1800000;
//                 res.redirect("/admin");
//               } else {
//                 res.redirect("/admin/login");
//               }
//             }
//           });
//         }
//       }
//     });
//   });

// router
//   .route("/new")
//   .get((req, res) => {
//     adminModel.countDocuments({}, (err, count) => {
//       if (err) {
//         console.error(err);
//         res.redirect("/admin/new");
//       } else {
//         if (count) {
//           res.redirect("/admin/login");
//         } else {
//           res.render("admin-register");
//         }
//       }
//     });
//   })
//   .post((req, res) => {
//     adminModel.countDocuments({}, (err, count) => {
//       if (err) {
//         console.error(err);
//         res.redirect("/admin/new");
//       } else {
//         if (count) {
//           res.redirect("/admin/login");
//         } else {
//           //validate new user

//           let data = {
//             username: req.body.username,
//             password: req.body.password,
//             password2: req.body.password2,
//           };

//           let newAdminUser = new adminModel(data);

//           newAdminUser.save((err) => {
//             if (err) {
//               console.err(err);
//               res.redirect("/admin/new");
//             }
//             res.end();
//           });
//         }
//       }
//     });
//   });

//Rutas relacionadas a la administracion de mascotas
router.use("/mascotas", petRouter);

//Rutas relacionadas a la administracion de accesorios

router.use("/accesorios", accesoriesRouter);

//
router.use("/ordenes", ordersRouter);
module.exports = router;
