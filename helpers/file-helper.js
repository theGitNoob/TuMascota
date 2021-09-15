const fs = require("fs/promises");

const moveFiles = async (images) => {
  return await Promise.all(
    images.map(({ oldPath, newPath }) => fs.rename(oldPath, newPath))
  );
};

const deleteFiles = async (images) => {
  return await Promise.all(images.map(fs.unlink)).catch((error) => {});
};

async function addImages(images, articleType) {
  let files = [];

  try {
    images.forEach((image) => {
      const imgExtension = image.originalname.substring(
        image.originalname.lastIndexOf(".") + 1
      );

      const currIdx = this.images.length;

      this.images.push({});

      this.images[
        currIdx
      ].url = `/public/img/${articleType}/${this.images[currIdx]._id}.${imgExtension}`;

      files.push({
        oldPath: image.path,
        newPath: `.${this.images[currIdx].url}`,
      });
    });

    return await moveFiles(files);
  } catch (err) {
    throw err;
  }
}
module.exports = { moveFiles, addImages, deleteFiles };
