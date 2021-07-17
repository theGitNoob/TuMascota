const crypto = require("crypto");

const genRandomBytes = async (size) => {
  return await new Promise((resolve, reject) => {
    crypto.randomBytes(size, async (err, rand) => {
      if (err) return reject(err);

      return resolve(rand.toString("hex"));
    });
  });
};
module.exports = { genRandomBytes };
