let express = require("express");
let router = express.Router();
const bcrypt = require("bcrypt");

require("../config/passport-config");

const { check } = require("express-validator");
const User = require("../models/user-model");
const { genRandomBytes } = require("../utils");

const {
  validEmail,
  passwordsMatch,
  validateUsername,
  emailNotExist,
  validateResults,
  isValidName,
  isValidLastName,
  isValidPhone,
  isValidPassword,
  isValidEmail,
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
  .get((req, res, next) => {
    res.render("login");
  })
  .post(logUser);

router
  .route("/register")
  .get((req, res, next) => {
    res.render("register");
  })
  .post(
    [
      check("name").custom(isValidName),
      check("lastname").custom(isValidLastName),
      check("username").custom(validateUsername),
      check("password").custom(isValidPassword),
      check("password2").custom(passwordsMatch),
      check("phone").custom(isValidPhone),
      check("email").custom(isValidEmail),
    ],
    registerUser
  );

//Ruta para validar la cuenta del usuario
router.get("/verify/:url", async (req, res, next) => {
  try {
    const user = await User.findOne({ verifyURL: req.params.url }).exec();

    if (user == null) {
      return next();
    }
    user.state = "active";
    user.verifyURL = undefined;
    await user.save();

    req.flash("sucesss", "Su cuenta ha sido confirmada");
    res.redirect("/users/login");
  } catch (err) {
    next(error);
  }
});

router.delete("/messages/delete_all", async (req, res, next) => {
  try {
    //FIXME:
    let user = req.user;
    user.mesages = [];
    user.newMessages = 0;
    await user.save();
    res.sendStatus(200).end();
  } catch (err) {
    next(err);
  }
});

router
  .route("/forgot_password")
  .get((req, res, next) => {
    res.render("forgot-password");
  })
  .post([check("email").custom(emailNotExist)], async (req, res, next) => {
    try {
      const errors = validateResults(req);
      const { email } = req.body;
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      } else {
        //TODO: Alertar que es link expira en 3h
        const user = await User.findOne({ email }).exec();
        let token = await Token.findOne({ userId: user._id }).exec();

        if (token) {
          await token.remove();
        }

        const resetToken = await genRandomBytes(32);

        const hash = await bcrypt.hash(resetToken, parseInt(process.env.SALT));

        await new Token({
          userId: user._id,
          token: hash,
          createdAt: Date.now(),
        }).save();

        const link = `${process.env.URL}/users/reset_password?token=${resetToken}&id=${user._id}`;

        const message = {
          from: process.env.MAIL_USER,
          to: req.body.email,
          subject: "Restablecer contraseña",
          text: "Por favor siga el siguiente enlace",
          html: getForgetHtml(link),
        };
        transporter.sendMail(message, (error) => {
          if (error) console.error(error);
        });

        return res.end();
      }
    } catch (error) {
      next(error);
    }
  });

router
  .route("/reset_password")
  .get(async (req, res, next) => {
    const { token, id } = req.query;
    res.render("reset-password", { token, id });
  })
  .put(
    [
      check("id", "El link no es válido o puede haber expirado").isMongoId(),
      check("password").custom(isValidPassword),
      check("password2").custom(passwordsMatch),
      check("token", "El link no es válido o puede haber expirado").notEmpty(),
    ],
    async (req, res, next) => {
      try {
        const errors = validateResults(req);
        const { token, id, password } = req.body;
        if (!errors.isEmpty()) {
          return res.status(400).json(errors.array());
        }

        const resetToken = await Token.findOne({ userId: id }).exec();
        if (!resetToken) {
          return res
            .status(400)
            .json("El link no es válido o puede haber expirado");
        }

        const isValid = await bcrypt.compare(token, resetToken.token);
        if (!isValid) {
          return res
            .status(400)
            .json("El link no es válido o puede haber expirado");
        }

        const hash = await bcrypt.hash(password, parseInt(process.env.SALT));

        await User.findByIdAndUpdate(id, { password: hash }).exec();
        await resetToken.remove();

        return res.end();
      } catch (err) {
        next(err);
      }
    }
  );

//TODO: limitar la cantidad de solicitudes con rate-limiter
router.post("/send_mail", sendEmail);
module.exports = router;
