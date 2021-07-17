const User = require("../models/user").userModel;
const { validationResult } = require("express-validator");

const emailExist = async (email = "", req) => {
  const exists = await User.findOne({ email });
  if (exists) {
    throw new Error(`El correo ya está registrado`);
  } else return true;
};

const usernameExists = async (username = "", req) => {
  const exists = await User.findOne({ username });
  if (exists) {
    throw new Error(`El nombre de usuario ya existe, por favor elija otro`);
  } else return true;
};

const passwordsMatch = (password2, { req }) => {
  if (password2 !== req.body.password) {
    throw new Error("Las contraseñas no coinciden");
  } else return true;
};

const emailNotExist = async (email = "", req) => {
  const exists = await User.findOne({ email });
  if (!exists) {
    throw new Error(`No hay ninguna cuenta asociada a este correo`);
  } else return true;
};

const validateResults = (req) => {
  return validationResult(req).formatWith(({ msg }) => msg);
};

module.exports = {
  emailExist,
  passwordsMatch,
  usernameExists,
  emailNotExist,
  validateResults,
};
