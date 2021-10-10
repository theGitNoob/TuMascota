const bcrypt = require("bcrypt");
const { Router } = require("express");
const { logoutUser } = require("../controllers/usuarios.controller");
const User = require("../models/user-model");
const { check } = require("express-validator");

const {
  passwordsMatch,
  validateResults,
  isValidLastName,
  isValidPhone,
} = require("../helpers/validators");

const router = Router();

router.get("/logout", logoutUser);

router.delete("/messages/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    let user = req.user;

    user.newMessages;

    let msg = user.messages.id(id);

    if (!msg) {
      return res.status(404).end();
    }
    if (msg.state === "new") {
      user.newMessages--;
    }

    await msg.remove();

    await user.save();
    res.status(200).end();
  } catch (err) {
    next(err);
  }
});

router.patch("/messages/", async (req, res, next) => {
  const { messages } = req.body;

  try {
    let user = req.user;

    messages.forEach((messageId) => {
      let userMessage = user.messages.id(messageId);
      userMessage.state = "old";
      if (user.newMessages > 0) user.newMessages--;
    });

    await user.save();

    res.end();
  } catch (err) {
    next(err);
  }
});

router
  .route("/modify_profile")
  .get((req, res, next) => {
    res.render("modificar-perfil");
  })
  .put(
    [
      check("name", "El nombre es obligatorio").notEmpty(),
      check("lastname").custom(isValidLastName),
      check("name", "El nombre solo debe contener letras").isAlpha(),
      check(
        "password",
        "La contraseña no debe tener mas de 50 caracteres"
      ).isLength({ max: 50 }),
      check("phone").custom(isValidPhone),
      check("address", "La dirección es obligatoria").notEmpty(),
      check("password2").custom(passwordsMatch),
    ],
    async (req, res, next) => {
      const errors = validateResults(req);

      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }

      let { phone, address, password, name, lastname, notify } = req.body;

      let newData = {
        phone,
        address,
        name,
        lastname,
        receiveNotification: notify === "on",
      };

      if (password) {
        password = await bcrypt.hash(password, process.env.SALT);
        newData.password = password;
      }

      let user = req.user;

      await user.updateOne(newData).exec();

      res.end();
    }
  );

module.exports = router;
