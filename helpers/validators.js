const User = require("../models/user");
const { validationResult } = require("express-validator");
const { isNumeric, isLength, isEmpty, isAlpha } = require("validator");
const { getCleanName } = require("../helpers/string-helper");
const Token = require("../models/token.model");
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

const imageUploaded = (image, { req }) => {
  if (!req.file) {
    throw new Error("Debe subir una imagen de la mascota");
  } else if (
    req.file.mimetype !== "image/jpeg" &&
    req.file.mimetype !== "image/png"
  ) {
    throw new Error("La imagen debe ser png o jpg");
  } else return true;
};

const isValidName = (name = "") => {
  if (isEmpty(name, { ignore_whitespace: true }))
    throw new Error("El nombre es obligatorio");

  if (!isLength(name, { max: 50 }))
    throw new Error("El nombre es damasiado largo");

  const arr = getCleanName(name).split(" ");

  if (arr.length > 2) throw new Error("No puede introducir más de dos nombres");

  if (!isAlpha(arr[0], ["es-ES"]))
    throw new Error("El nombre solo debe contener letras");

  if (arr[1] && !isAlpha(arr[1], ["es-ES"]))
    throw new Error("El nombre solo debe contener letras");

  return true;
};

const isValidLastName = (lastname = "") => {
  if (!isLength(lastname, { max: 50 }))
    throw new Error("El apellido es damasiado largo");

  const arr = getCleanName(lastname).split(" ");

  if (arr.length > 2)
    throw new Error("No puede introducir más de dos apellidos");

  if (!isAlpha(arr[0], ["es-ES"]))
    throw new Error("Los apellidos solo deben contener letras");

  if (arr[1] && !isAlpha(arr[1], ["es-ES"]))
    throw new Error("Los apellidos solo deben contener letras");

  return true;
};

const isValidPassword = (password) => {};

const isValidPhone = (phone = "") => {
  if (!isNumeric(phone) || phone.length < 8) {
    throw new Error("El número de télefono no es válido");
  }
  return true;
};

module.exports = {
  emailExist,
  passwordsMatch,
  usernameExists,
  emailNotExist,
  validateResults,
  imageUploaded,
  isValidName,
  isValidLastName,
  isValidPhone,
  isValidPassword,
};
