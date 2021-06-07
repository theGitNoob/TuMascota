let validator = require("validator");
function parsePhone(phone) {
  phone = phone.replace(/ /g, "");
  if (phone.startsWith("+")) phone = phone.substring(1);
  if (phone.length == 10) phone = phone.substring(2);
  return phone;
}

function validateUserRegistration(userData) {
  let errors = [];
  if (validator.isEmpty(userData.name)) {
    errors.push("El nombre no debe estar vacio");
  } else if (!validator.isAlpha(userData.name.replace(/ /g, ""))) {
    errors.push("El nombre solo debe contener letras del alfabeto español");
  }
  if (validator.isEmpty(userData.password)) {
    errors.push("Debe introducir una contraseña");
  }
  console.log(userData.password, userData.password_confirmation);
  if (userData.password !== userData.password_confirmation) {
    errors.push("Las contraseñas no coinciden");
  }
  if (!validator.isEmpty(userData.email)) {
    if (!validator.isEmail(userData.email)) {
      errors.push("El correo no es válido");
    }
  } else if (validator.isEmpty(userData.email)) {
    errors.push("El correo el obligatorio");
  }
  return errors;
}
module.exports.parsePhone = parsePhone;
module.exports.validateUserRegistration = validateUserRegistration;
