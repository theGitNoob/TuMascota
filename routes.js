let express = require("express");
let router = express.Router();
let userModel = require("./models/user").userModel;
let orderModel = require("./models/order").orderModel;
let petModel = require("./models/pet").petModel;
let parsePhone = require("./utils").parsePhone;
let validator = require("validator");

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

router.post("/mascotas/orders/new/:id", async (req, res) => {
  try {
    let pet = await petModel.findById(req.params.id);
    if (pet == null) {
      res.redirect("/mascotas");
    }
    let user = await userModel.findById(req.session.user_id);
    if (user == null) {
      res.redirect("/mascotas");
    }
    // console.log(user);
    // console.log(pet);
    // res.end();
    if (pet.available) {
      let cnt = req.body.cnt > pet.cnt ? pet.cnt : req.body.cnt;

      let newOrder = new orderModel({
        articleId: pet._id,
        articleType: "mascota",
        owner: user._id,
        cnt: cnt,
      });

      await newOrder.save();
      pet.cnt -= cnt;
      pet.available = pet.cnt == 0 ? false : true;
      await pet.save({ validateModifiedOnly: true });
      res.redirect("/mascotas");
      // if()
      // la mascota esta disponible restarle  a la cantidad disponible la cantidad de mascotas q hay
      // y marcarla como no disponible en caso de q ya no lo este
    } else {
      // la mascota no esta disponible ya notificar de esto
      res.send("Lo sentimoas la mascota no s eencuentra disponible");
    }
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
