const fs = require("fs/promises");

const moveFiles = async (files) => {
  for await (file of files) {
    fs.rename(file.oldPath, file.newPath);
  }
};

module.exports = { moveFiles };
