const { validationResult } = require("express-validator");
const { isNumeric, isLength, isEmpty, isAlpha, isEmail } = require("validator");
const { getCleanName } = require("../helpers/string-helper");
const User = require("../models/user-model");

const isValidEmail = async (email = "", req) => {
  if (!isEmail(email)) {
    throw new Error("El correo no es válido");
  }
  //FIXME:Hacer que envie un status 500 en caso de ocurra un error al hacer el lookup en la db
  const exists = await User.findOne({ email })
    .exec()
    .catch((err) => {
      if (err) {
        //TODO:...
        console.error(err);
      }
    });
  if (exists) {
    throw new Error("El correo ya está registrado");
  } else return true;
};

const emailNotExist = async (email = "", req) => {
  if (!isEmail(email)) {
    throw new Error("El correo no es válido");
  }
  const exists = await User.findOne({ email })
    .exec()
    .catch((err) => {
      if (err) {
        //TODO:...
        console.error(err);
      }
    });
  if (!exists) {
    throw new Error(`No hay ninguna cuenta asociada a este correo`);
  } else return true;
};

const validateUsername = async (username = "", req) => {
  if (!username) {
    throw new Error("El nombre de usuario es obligatorio");
  }

  if (username.includes("")) {
    throw new Error("El nombre de usuario no debe tener espacios en blancos");
  }

  if (!isLength(username, { max: 50 })) {
    throw new Error("El nombre de usuario es demasiado largo");
  }

  const exists = await User.findOne({ username })
    .exec()
    .catch((err) => {
      if (err) {
        //TODO:...
        console.error(err);
      }
    });
  if (exists) {
    throw new Error("El nombre de usuario ya existe, por favor elija otro");
  } else return true;
};

const passwordsMatch = (password2, { req }) => {
  if (password2 !== req.body.password) {
    throw new Error("Las contraseñas no coinciden");
  } else return true;
};

const validateResults = (req) => {
  return validationResult(req).formatWith(({ param, msg }) => {
    let obj = { field: param, msg };
    return obj;
  });
};

const imageUploaded = (images, { req }) => {
  const files = req.files;

  if (!files) {
    throw new Error("Debe subir una imagen de la mascota");
  } else if (
    files.some(
      (file) => file.mimetype !== "image/jpeg" && file.mimetype !== "image/png"
    )
  ) {
    throw new Error("Las imagenes deben ser png o jpg");
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

const isValidPassword = (password = "") => {
  if (!isLength(password, { max: 50 })) {
    throw new Error("La contraseña no debe tener mas de 50 caracteres");
  }

  if (!isLength(password, { min: 6 })) {
    throw new Error("contraseña es demasiado corta");
  }

  return true;
};

const isValidPhone = (phone = "") => {
  if (!phone) {
    throw new Error("El número de télefono es obligatorio");
  }

  if (!isNumeric(phone) || phone.length < 8) {
    throw new Error("El número de télefono no es válido");
  }

  return true;
};

const validatePrice = (price) => {
  if (isEmpty(price)) {
    throw new Error("El precio no debe estar vacío");
  } else if (isNumeric(price)) {
    throw new Error("El precio debe ser un número");
  }

  return true;
};

module.exports = {
  isValidEmail,
  passwordsMatch,
  emailNotExist,
  validateUsername,
  validateResults,
  imageUploaded,
  isValidName,
  isValidLastName,
  isValidPhone,
  isValidPassword,
  validatePrice,
};
