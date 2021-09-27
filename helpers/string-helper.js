const getCleanName = (name = "") => {
  name = name.trim();
  return name.replace(/ +/, " ");
};

const capitalize = (cad = "") => {
  let capCad = cad[0].toUpperCase() + cad.slice(1).toLocaleLowerCase();
  return capCad;
};

module.exports = {
  getCleanName,
  capitalize,
};
