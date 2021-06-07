let express = require("express");
let router = express.Router();
let userModel = require("../models/user").userModel;
let parsePhone = require("../utils").parsePhone;
let validateUserRegistration = require("../utils").validateUserRegistration;
let passport = require("passport");
let LocalStrategy = require("passport-local").Strategy;
let bcrypt = require("bcryptjs");
let crypto = require("crypto");
let nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: "smtp.nauta.cu",
  port: 25,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: "racosta011220@nauta.cu",
    pass: "qmxU9qqw",
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false,
  },
});

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  userModel.findById(id, (err, user) => {
    if (user) user.password = undefined;
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
        // user.isAdmin =
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
    if (req.isAuthenticated()) res.redirect("/");
    else res.render("login");
  })
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureFlash: {
        type: "alert alert-danger",
        message: "El nombre o la contraseña son incorrectos",
      },
      failureRedirect: "/users/login",
    }),
    (req, res) => {
      if (!req.user.confirmed) {
        req.logout();
        req.flash("alert alert-danger", "Su cuenta aun no ha sido confirmada");

        res.redirect("/users/login");
        return;
      }
      req.flash(
        "alert alert-success",
        "Usted ha iniciado session correctamente"
      );
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
  .post(async (req, res, next) => {
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
          crypto.randomBytes(16, async (err, rand) => {
            if (err) {
              throw err;
            }
            let customURL = newUser._id + rand.toString("hex");
            newUser.verifyURL = customURL;

            await newUser.save();

            // aun tengo q testear esto

            let message = {
              from: "racosta011220@nauta.cu",
              to: req.body.email,
              subject: "Confirme su cuenta",
              text: "Por favor siga el siguiente enlace",
              html: `<p>Siga el siguiente link para confirmar su cuenta<a href=192.168.43.224:8080/users/verify/${newUser.verifyURL}>Click Aquí</a></p>`,
            };

            transporter.sendMail(message, (err) => {});

            let pattern = "8080/";
            let path = req.headers.referer.split(pattern)[1];
            res.redirect(`/${path}`);
          });
        });
      }
    } catch (err) {
      console.err(err);
      next(err);
    }
  });

router.get("/logout", (req, res, next) => {
  if (req.isAuthenticated()) {
    req.logout();
    req.flash("alert alert-success", "Su sessión ha sido cerrada");
    // nombre de dominio
    // let pattern = "8080/";
    // let path = req.headers.referer.split(pattern)[1];
    // res.redirect(`/${path}`);
    res.redirect("/users/login");
  } else {
    next();
  }
});

router.get("/verify/:url", async (req, res, next) => {
  try {
    let user = await userModel.findOne({ verifyURL: req.params.url });
    if (user == null) {
      next();
    }
    user.confirmed = true;
    user.verifyURL = undefined;
    await user.save();
    req.flash(
      "alert alert-success",
      "Su cuenta ha sido confirmada ahora puede iniciar session"
    );
    res.redirect("/users/login");
  } catch (error) {}
});
router.get("/forgot_password", (req, res) => {});
module.exports = router;
