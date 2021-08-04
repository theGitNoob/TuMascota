let express = require("express");
let router = express.Router();
const bcrypt = require("bcrypt");

require("../config/passport-config");

const { check } = require("express-validator");
const User = require("../models/user");
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
const {
  logUser,
  registerUser,
  sendEmail,
} = require("../controllers/usuarios.controller");

//TODO: Cambiar passport por JWT

router
  .route("/login")
  .get((req, res) => {
    res.render("login");
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

router.get("/verify/:url", async (req, res, next) => {
  try {
    const user = await User.findOne({ verifyURL: req.params.url });
    if (user == null) {
      return next();
    }
    user.state = "active";
    user.verifyURL = undefined;
    await user.save();

    res.json({
      msg: "Su cuenta ha sido confirmada, ahora puede iniciar sesión",
    });

    // res.redirect("/users/login");
  } catch (error) {
    next(error);
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

//TODO: Implementar un middleware para saber si el usario está
//autenticado
router
  .route("/forgot_password")
  .get((req, res) => {
    res.render("forgot-password");
  })
  .post(
    [
      check("email", "El correo no es válido").isEmail(),
      check("email").custom(emailNotExist),
    ],
    async (req, res, next) => {
      console.time();
      try {
        const errors = validateResults(req);

        const { email } = req.body;
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        } else {
          //TODO: Alertar que es link expira en 3h
          const user = await User.findOne({ email });
          let token = await Token.findOne({ userId: user._id });

          if (token) {
            await token.deleteOne();
          }

          const resetToken = await genRandomBytes(32);

          const hash = await bcrypt.hash(resetToken, 10);

          await new Token({
            userId: user._id,
            token: hash,
            createdAt: Date.now(),
          }).save();

          const link = `http://${process.env.URL}/users/reset_password?token=${resetToken}&id=${user._id}`;

          const message = {
            from: process.env.MAIL_USER,
            to: req.body.email,
            subject: "Restablecer contraseña",
            text: "Por favor siga el siguiente enlace",
            html: getForgetHtml(link),
          };
          transporter.sendMail(message, (error) => {});

          // console.timeEnd();
          return res.end();
        }
      } catch (error) {
        // console.error(error);
        next(error);
      }
    }
  );

router
  .route("/reset_password")
  .get(async (req, res) => {
    const { token, id } = req.query;
    res.render("reset_password", { token, id });
  })
  .put(
    [
      check("password", "La contraseña no debe estar vacía").notEmpty(),
      check(
        "password",
        "La contraseña no debe tener mas de 50 caracteres"
      ).isLength({ max: 50 }),
      check("id", "El link no es válido o puede haber expirado").isMongoId(),
      check("password2").custom(passwordsMatch),
      check("token", "El link no es válido o puede haber expirado").notEmpty(),
    ],
    async (req, res) => {
      try {
        const errors = validateResults(req);
        const { token, id, password } = req.body;
        if (!errors.isEmpty()) {
          return res.json(errors.array());
        }

        const resetToken = await Token.findOne({ userId: id });

        if (!resetToken) {
          return res.json("El link no es válido o puede haber expirado");
        }

        const isValid = await bcrypt.compare(token, resetToken.token);

        if (!isValid) {
          return res.json("El link no es válido o puede haber expirado");
        }

        const hash = await bcrypt.hash(password, 10);
        await User.findByIdAndUpdate(id, { password: hash });

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
