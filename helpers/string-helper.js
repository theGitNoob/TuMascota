const getCleanName = (name = "") => {
  name = name.trim();
  return name.replace(/ +/, " ");
};

const getFileExtension = (fileName) => {
  return fileName.substring(fileName.lastIndexOf(".") + 1);
};

const getFileName = (fileName) => {
  return fileName.substring(0, fileName.lastIndexOf("."));
};

const capitalize = (cad = "") => {
  let capCad = cad[0].toUpperCase() + cad.slice(1).toLocaleLowerCase();
  return capCad;
};

module.exports = {
  getCleanName,
  capitalize,
  getFileExtension,
  getFileName,
};
