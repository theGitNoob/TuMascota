const { Router } = require("express");
const { logoutUser } = require("../controllers/usuarios.controller");
const User = require("../models/user-model");
const { check } = require("express-validator");

const {
  passwordsMatch,
  validateResults,
  isValidLastName,
} = require("../helpers/validators");

const router = Router();

router.get("/logout", logoutUser);

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
  .get((req, res) => {
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
      check("phone", "El télefono es obligatorio").notEmpty(),
      check("address", "La dirección es obligatoria").notEmpty(),
      check("password2").custom(passwordsMatch),
    ],
    async (req, res) => {
      const errors = validateResults(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
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
        password = await bcrypt.hash(password, 10);
        newData.password = password;
      }

      let user = req.user;

      await user.updateOne(newData).exec();

      res.redirect("/users/modify_profile");
    }
  );

module.exports = router;
