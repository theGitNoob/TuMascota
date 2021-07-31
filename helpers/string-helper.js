const getCleanName = (name = "") => {
  name = name.trim();
  return name.replace(/ +/, " ");
};

module.exports = {
  getCleanName,
};
