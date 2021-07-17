const util = require("util");
let express = require("express");
let router = express.Router();
let passport = require("passport");
let LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");
const userModel = require("../models/user").userModel;
const { genRandomBytes } = require("../utils");
const {
  emailExist,
  passwordsMatch,
  usernameExists,
  emailNotExist,
  isValidId,
  validateResults,
} = require("../helpers/validators");
const Token = require("../models/token.model");
const { transporter } = require("../config/nodemailer-config");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  userModel.findById(id, (err, user) => {
    if (user) {
      user.password = undefined;
      user.__v = undefined;
    }
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
      res.redirect("/");
    }
  );

router
  .route("/register")
  .get((req, res) => {
    res.render("register");
  })
  .post(
    [
      check("name", "El Nombre es obligatorio").notEmpty(),
      check("name", "El nombre solo debe contener letras").isAlpha(),
      check("username", "El Nombre de usuario es obligatorio").notEmpty(),
      check("email", "El correo no es válido").isEmail(),
      check("password", "La contraseña no debe estar vacía").notEmpty(),
      check("phone", "El télefono es obligatorio").notEmpty(),
      check("password2").custom(passwordsMatch),
      check("email").custom(emailExist),
      check("username").custom(usernameExists),
    ],
    async (req, res, next) => {
      try {
        const result = validateResults(req);

        // req.body.phone = parsePhone(req.body.phone);
        const { name, username, password, phone, email } = req.body;
        const user = {
          name,
          username,
          password,
          phone,
          email,
        };

        if (!result.isEmpty()) {
          req.flash("alert alert-danger", result.array());
          res.redirect("/users/register");
          return;
        }

        let newUser = new userModel(user);

        const [hash, randomBytes] = await Promise.all([
          bcrypt.hash(newUser.password, 10),
          genRandomBytes(16),
        ]);

        newUser.password = hash;
        newUser.verifyURL = newUser._id + randomBytes;

        await newUser.save();
        const link = `http://${process.env.URL}/users/verify/${newUser.verifyURL}`;
        console.log(link);
        const message = {
          from: "racosta011220@nauta.cu",
          to: req.body.email,
          subject: "Confirme su cuenta",
          text: "Por favor siga el siguiente enlace",
          html: `<p>Siga el siguiente link para confirmar su cuenta <a href="${link}">Click Aquí</a></p>`,
        };

        transporter.sendMail(message, (err) => {
          // console.log(err);
        });

        res.redirect("/users/login");
      } catch (err) {
        console.error(err);
        next(err);
      }
    }
  );

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
    const user = await userModel.findOne({ verifyURL: req.params.url });
    if (user == null) {
      return next();
    }
    user.confirmed = true;
    user.verifyURL = undefined;
    await user.save();

    req.flash(
      "alert alert-success",
      "Su cuenta ha sido confirmada, ahora puede iniciar session"
    );

    res.redirect("/users/login");
  } catch (error) {
    next(error);
  }
});

router.delete("/message/:id", async (req, res) => {
  try {
    let user = req.user;
    user.messages.id(req.params.id).remove();
    await req.user.save();
    res.sendStatus(200).end();
  } catch (error) {
    res.sendStatus(404).end();
  }
});

router.delete("/messages/delete_all", async (req, res) => {
  try {
    let user = req.user;
    user.mesages = [];
    user.notifications = 0;
    await user.save();
    res.sendStatus(200).end();
  } catch (error) {
    console.log("erro");
    res.sendStatus(404).end();
  }
});

router.patch("/messages/view_all", async (req, res) => {
  try {
    req.user.notifications = 0;
    await req.user.save();
    res.sendStatus(200).end();
  } catch (error) {
    res.sendStatus(404).end();
  }
});

router
  .route("/modify_profile")
  .all((req, res, next) => {
    if (req.user) next();
    else res.redirect("/");
  })
  .get((req, res) => {
    // res.render("modify-profile", req.user);
    res.sendFile(
      "D:/Rafael/Programing/CODES/JS/ProyectoSadan/modificar-perfil.html"
    );
    // res.json(req.user);
  })
  .put(
    [
      check("name", "El Nombre es obligatorio").notEmpty(),
      check("name", "El nombre solo debe contener letras").isAlpha(),
      // check("username", "El Nombre de usuario es obligatorio").notEmpty(),
      check("password", "La contraseña no debe estar vacía").notEmpty(),
      check("phone", "El télefono es obligatorio").notEmpty(),
      check("password2").custom(passwordsMatch),
      // check("username").custom(usernameExists),
    ],
    async (req, res) => {
      const errors = validateResults(req);
      if (!errors.isEmpty()) {
        req.flash("alert alert-danger", errors.array());
        return res.redirect("/users/register");
      }
      console.log(errors.array());
      let { phone, address, password } = req.body;
      password = await bcrypt.hash(password, 10);
      const user = await userModel.findByIdAndUpdate(req.user.id, {
        phone,
        address,
        password,
      });
      res.redirect("/users/modify_profile");
    }
  );

router
  .route("/forgot_password")
  .all((req, res, next) => {
    if (req.user) {
      return res.redirect("/");
    }
    next();
  })
  .get((req, res) => {
    console.log("pepe");
    res.render("forgot-password");
  })
  .post(
    [
      check("email", "El correo no es válido").isEmail(),
      check("email").custom(emailNotExist),
    ],
    async (req, res) => {
      try {
        const errors = validateResults(req);

        // console.log(errors.array());
        // res.json(errors);
        const { email } = req.body;
        if (!errors.isEmpty()) {
          req.flash("alert alert-danger", errors.array());
          res.redirect("/users/forgot_password");
        } else {
          const user = await userModel.findOne({ email });
          let token = await Token.findOne({ userId: user._id });
          if (token) {
            await token.deleteOne();
          }
          let resetToken = await genRandomBytes(32);

          const hash = await bcrypt.hash(resetToken, 10);

          console.log(resetToken, hash);

          await new Token({
            userId: user._id,
            token: hash,
            createdAt: Date.now(),
          }).save();

          const link = `http://${process.env.URL}/users/reset_password?token=${resetToken}&id=${user._id}`;
          const message = {
            from: "racosta011220@nauta.cu",
            to: req.body.email,
            subject: "Restablecer contraseña",
            text: "Por favor siga el siguiente enlace",
            html: `<p>Siga el siguiente link para reiniciar su contraseña <a href="${link}">Click Aquí</a></p>`,
          };
          console.log(link);
          await transporter.sendMail(message);

          req.flash("alert alert-success", "Hemos enviado un correo");
          return res.redirect("/users/forgot_password");
        }
      } catch (error) {
        console.error(error);
      }
    }
  );

router
  .route("/reset_password")
  .all((req, res, next) => {
    if (req.user) {
      return res.redirect("/");
    }
    return next();
  })
  .get(async (req, res) => {
    // res.render("reset-password");
    const { token, id } = req.query;
    res.render("reset-password", { token, id });
  })
  .put(
    [
      check("password", "La contraseña no debe estar vacía").notEmpty(),
      check("password2").custom(passwordsMatch),
      check("token", "El link no es válido o puede haber expirado").notEmpty(),
      check("id", "El link no es válido o puede haber expirado").isMongoId(),
    ],
    async (req, res) => {
      try {
        const errors = validateResults(req);
        const { token, id, password, password2 } = req.body;
        if (!errors.isEmpty()) {
          req.flash("alert alert-danger", errors.array());
          return res.redirect(`/users/reset_password?token=${token}&id=${id}`);
        }

        let resetToken = await Token.findOne({ userId: id });

        if (!resetToken) {
          req.flash(
            "alert alert-danger",
            "El link no es válido o puede haber expirado"
          );
          return res.redirect(`/users/reset_password?token=${token}&id=${id}`);
        }

        const isValid = await bcrypt.compare(token, resetToken.token);

        if (!isValid) {
          req.flash(
            "alert alert-danger",
            "El link no es válido o puede haber expirado"
          );
          return res.redirect(`/users/reset_password?token=${token}&id=${id}`);
        }

        const hash = await bcrypt.hash(password, 10);
        await userModel.findByIdAndUpdate(id, { password: hash });

        req.flash(
          "alert alert-success",
          "Su contraseña ha sido cambiada correctamente"
        );

        res.redirect("/users/login");
      } catch (error) {
        console.log(error);
      }
    }
  );

module.exports = router;
