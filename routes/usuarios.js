let express = require("express");
let router = express.Router();
let passport = require("passport");
let LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { check } = require("express-validator");
const userModel = require("../models/user").userModel;
const { genRandomBytes } = require("../utils");
const {
  emailExist,
  passwordsMatch,
  usernameExists,
  emailNotExist,
  validateResults,
  isValidName,
  isValidLastName,
  isValidPhone,
} = require("../helpers/validators");
const { getForgetHtml } = require("../helpers/get-template-html");
const Token = require("../models/token.model");
const { transporter } = require("../config/nodemailer-config");
const { getCleanName } = require("../helpers/string-helper");
const {
  logUser,
  registerUser,
  logoutUser,
  sendEmail,
} = require("../controllers/usuarios.controller");

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

//TODO: Cambiar passport por JWT

router
  .route("/login")
  .get((req, res) => {
    if (req.isAuthenticated()) res.redirect("/");
    else res.render("login");
  })
  .post(logUser);

router
  .route("/register")
  .get((req, res) => {
    res.render("register");
  })
  .post(
    [
      check("name").custom(isValidName),
      check("lastname").custom(isValidLastName),
      check("phone", "El télefono es obligatorio").notEmpty(),
      check("phone").custom(isValidPhone),
      check("email", "El correo no es válido").isEmail(),
      check("email").custom(emailExist),
      check("username", "El nombre de usuario es obligatorio").notEmpty(),
      check("username", "El nombre de usuario es muy largo").isLength({
        max: 50,
      }),
      check("username").custom(usernameExists),
      check("password", "La contraseña es demasiado corta").isLength({
        min: 8,
      }),
      check(
        "password",
        "La contraseña no debe tener mas de 50 caracteres"
      ).isLength({ max: 50 }),
      check("password2").custom(passwordsMatch),
    ],
    registerUser
  );

router.get("/logout", logoutUser);

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
    res.render("modificar-perfil");
    // res.sendFile(
    //   "D:/Rafael/Programing/CODES/JS/ProyectoSadan/modificar-perfil.html"
    // );
    // res.json(req.user);
  })
  .put(
    [
      check("name", "El nombre es obligatorio").notEmpty(),
      check("name", "El nombre solo debe contener letras").isAlpha(),
      check(
        "password",
        "La contraseña no debe tener mas de 50 caracteres"
      ).isLength({ max: 50 }),
      check("phone", "El télefono es obligatorio").notEmpty(),
      check("address", "La dirección es obligatoria").notEmpty(),
      check("password2").custom(passwordsMatch),
    ],
    async (req, res) => {
      const errors = validateResults(req);
      if (!errors.isEmpty()) {
        req.flash("alert alert-danger", errors.array());
        // return res.redirect("/users/modify_profile");
        return res.status(400).json({ errors: errors.array() });
      }

      let { phone, address, password, name } = req.body;

      let newData = { phone, address, name };

      if (password) {
        password = await bcrypt.hash(password, 10);
        newData.password = password;
      }

      console.log(newData);
      const user = await userModel.findByIdAndUpdate(req.user.id, newData);
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
          // req.flash("alert alert-danger", errors.array());
          // res.redirect("/users/forgot_password");
          return res.status(400).json({ errors: errors.array() });
        } else {
          const user = await userModel.findOne({ email });
          let token = await Token.findOne({ userId: user._id });
          if (token) {
            await token.deleteOne();
          }
          let resetToken = await genRandomBytes(32);

          const hash = await bcrypt.hash(resetToken, 10);

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
            html: getForgetHtml(link),
          };
          transporter.sendMail(message, (error) => {});

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
      check(
        "password",
        "La contraseña no debe tener mas de 50 caracteres"
      ).isLength({ max: 50 }),
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

//TODO: ruta para reenviar el correo en caso de que no le llegue al usuario
router.post("/send_email", sendEmail);
module.exports = router;
