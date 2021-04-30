let express = require("express");
let router = express.Router();
let userModel = require("./models/user").userModel;
let orderModel = require("./models/order").orderModel;
let petModel = require("./models/pet").petModel;
let parsePhone = require("./utils").parsePhone;
let validator = require("validator");
let accesoriesModel = require("./models/accesorie").accesoriesModel;

router
  .route("/users/sign_in")
  .get((req, res) => {
    res.render("login");
  })
  .post((req, res, next) => {
    req.body.phone = parsePhone(req.body.phone);

    if (!validator.isMobilePhone(req.body.phone)) {
      res.send("En numero de telefono no es valido");
      return;
    }
    let userData = {
      phone: req.body.phone,
      password: req.body.password,
    };

    userModel
      .findOne(userData)
      .then((user) => {
        if (user != null) {
          req.session.user_id = user._id;
          res.redirect("/");
        } else {
          res.send("Usuario o contraseña incorreta");
        }
      })
      .catch((err) => {
        console.err(error);
        res.redirect("/");
      });
  });

router
  .route("/users/sign_up")
  .get((req, res) => {
    res.render("register");
  })
  .post(async (req, res) => {
    req.body.phone = parsePhone(req.body.phone);

    userData = JSON.parse(JSON.stringify(req.body));

    if (userData.email === "") {
      userData.email = undefined;
    }
    try {
      let user = await userModel.findOne({ phone: req.body.phone });
      if (user != null) {
        res.send("El numero de telefono ya esta registrado");
      } else {
        let newUser = new userModel(userData);
        user = await newUser.save();
        res.redirect("/");
      }
    } catch (err) {
      let parsedErr = JSON.parse(JSON.stringify(err));

      let message = parsedErr.message;
      if (message != undefined) {
        message = message.substring(message.lastIndexOf(":") + 2);
        console.error(message);
        res.send(message);
      } else {
        console.error(err);
        // res.redirect("/users/sign_up");
      }
    }
  });

router.get("/users/forgot_password", (req, res) => {});

// esto va a ser eliminado
router.get("/mascotas/order/:id", (req, res) => {
  res.send("No jodas mas");
});

router.post("/mascotas/ordenes/:id", async (req, res) => {
  try {
    let pet = await petModel.findById(req.params.id);
    if (pet == null) {
      res.redirect("/mascotas");
    }

    let user = await userModel.findById(req.session.user_id);
    if (user == null) {
      res.redirect("/mascotas");
    }

    if (pet.available) {
      let cnt = req.body.cnt > pet.cnt ? pet.cnt : req.body.cnt;

      let newOrder = new orderModel({
        articleId: pet._id,
        articleType: "mascota",
        owner: user._id,
        cnt: cnt,
        price: cnt * pet.price,
      });

      await newOrder.save();

      pet.cnt -= cnt;
      pet.stagedCnt += cnt;
      pet.available = pet.cnt == 0 ? false : true;

      await pet.save({ validateModifiedOnly: true });

      res.redirect("/mascotas");
    } else {
      // la mascota no esta disponible ya notificar de esto
      res.send("Lo sentimoas la mascota no s eencuentra disponible");
    }
  } catch (err) {
    console.error(err);
  }
});

router
  .route("/mascotas")
  .get(async (req, res) => {
    try {
      let obj = Object.keys(req.query);
      let filters = [];

      obj.forEach((elem) => {
        if (req.query[elem] === "on") {
          filters.push(elem);
        }
      });

      let findOpts = { available: true };
      if (filters.length) {
        findOpts.type = { $in: filters };
      }

      let mascotas = await petModel.find(findOpts);

      let opts = { mascotas: mascotas };

      filters.forEach((element) => {
        opts[element] = true;
      });

      res.render("mascotas2", opts);
    } catch (err) {
      console.error(err);
      res.redirect("/");
    }
  })
  .post(async (req, res) => {
    // try {
    //   let json = JSON.parse(JSON.stringify(req.body));
    //   let filters = Object.keys(json);
    //   let findOpts = { available: true };
    //   if (filters.length) {
    //     findOpts.type = { $in: filters };
    //   }
    //   let mascotas = await petModel.find(findOpts);
    //   let opts = { mascotas: mascotas };
    //   filters.forEach((element) => {
    //     opts[element] = true;
    //   });
    //   res.render("mascotas2", opts);
    // } catch (err) {
    //   console.error(err);
    // }
  });

router.get("/accesorios", async (req, res) => {
  try {
    let accesorios = await accesoriesModel.find({ available: true });
    res.render("accesorios", { accesorios: accesorios });
  } catch (err) {
    console.error(err);
  }
});

router.post("/accesorios/ordenes/:id", async (req, res) => {
  try {
    let accesorie = await accesoriesModel.findById(req.params.id);
    if (accesorie == null) {
      res.redirect("/accesorios");
    }

    let user = await userModel.findById(req.session.user_id);
    if (user == null) {
      res.redirect("/accesorios");
    }

    if (accesorie.available) {
      let cnt = req.body.cnt > accesorie.cnt ? accesorie.cnt : req.body.cnt;

      let newOrder = new orderModel({
        articleId: accesorie._id,
        articleType: "accesorio",
        owner: user._id,
        cnt: cnt,
        price: cnt * accesorie.price,
      });

      await newOrder.save();

      accesorie.cnt -= cnt;
      accesorie.stagedCnt += cnt;
      accesorie.available = accesorie.cnt == 0 ? false : true;

      await accesorie.save({ validateModifiedOnly: true });

      res.redirect("/accesorios");
    } else {
      // la mascota no esta disponible ya notificar de esto
      res.send("Lo sentimoas la mascota no s eencuentra disponible");
    }
  } catch (err) {
    console.error(err);
  }
});

router.get("/servicios", (req, res) => {
  res.render("servicios");
});
module.exports = router;
