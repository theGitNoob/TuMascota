const { rename, unlink } = require("fs/promises");
const { getFileExtension } = require("../helpers/string-helper");

const moveFiles = async (images) => {
  return await Promise.all(
    images.map(({ oldPath, newPath }) => rename(oldPath, newPath))
  );
};

const deleteImages = async (images) => {
  return await Promise.all(images.map(({ url }) => unlink(url.slice(1))));
};

async function addImages(images, articleType) {
  let files = [];

  try {
    images.forEach((image) => {
      const imgExtension = getFileExtension(image.originalname);

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
module.exports = { moveFiles, addImages, deleteImages };
