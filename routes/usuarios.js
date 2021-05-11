let express = require("express");
let router = express.Router();
let userModel = require("../models/user").userModel;
let parsePhone = require("../utils").parsePhone;
let validateUserRegistration = require("../utils").validateUserRegistration;
let passport = require("passport");
let LocalStrategy = require("passport-local").Strategy;
let bcrypt = require("bcryptjs");
let crypto = require("crypto");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  userModel.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      let user = await userModel.findOne({ username: username });
      if (!user) return done(null, false);
      let res = await bcrypt.compare(password, user.password);
      if (res) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err);
    }
  })
);

router
  .route("/login")
  .get((req, res) => {
    console.log(req.user);
    if (req.isAuthenticated()) res.redirect("/");
    else res.render("login");
  })
  .post(
    passport.authenticate("local", {
      failureFlash: "El nombre o la contraseña son incorrectos",
      failureRedirect: "/users/login",
    }),
    (req, res) => {
      // new Promise(resolve,rejec)
      req.flash(
        "alert alert-success",
        "Usted ha iniciado session correctamente"
      );
      console.log("das");
      let pattern = "8080/";
      let path = req.headers.referer.split(pattern)[1];
      res.redirect(`/${path}`);
    }
  );

router
  .route("/register")
  .get((req, res) => {
    res.render("register");
  })
  .post(async (req, res) => {
    req.body.phone = parsePhone(req.body.phone);

    userData = JSON.parse(JSON.stringify(req.body));

    if (userData.email === "") {
      userData.email = undefined;
    }
    let errors = [];
    try {
      let phone = await userModel.findOne({ phone: req.body.phone });
      let username = await userModel.findOne({ username: req.body.username });
      let email = await userModel.findOne({ email: req.body.email });

      if (phone !== null) {
        errors.push("El numero de telefono ya está registrado");
      }
      if (username !== null) {
        errors.push("El nombre de usuario ya esta registrado");
      }
      if (email !== null) {
        errors.push("El correo electronico ya está en uso");
      }
      errors.push(...validateUserRegistration(req.body));
      if (errors.length) {
        req.flash("alert alert-danger", errors);
        res.redirect("/users/register");
      } else {
        let newUser = new userModel(userData);
        bcrypt.hash(newUser.password, 10, async (err, hash) => {
          if (err) {
            throw err;
          }
          newUser.password = hash;
          await newUser.save();
          let pattern = "8080/";
          let path = req.headers.referer.split(pattern)[1];
          console.log(path);
          res.redirect(`/${path}`);
        });
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
        // res.redirect("/users/register");
      }
    }
  });

router.get("/logout", (req, res, next) => {
  if (req.isAuthenticated()) {
    req.logout();
    req.flash("alert alert-success", "Su sessión ha sido cerrada");
    // nombre de dominio
    let pattern = "8080/";
    let path = req.headers.referer.split(pattern)[1];
    res.redirect(`/${path}`);
  } else {
    next();
  }
});

router.get("/forgot_password", (req, res) => {});
module.exports = router;
