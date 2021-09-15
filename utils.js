const crypto = require("crypto");

const genRandomBytes = (size) => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(size,  (err, rand) => {
      if (err) return reject(err);

      return resolve(rand.toString("hex"));
    });
  });
};
module.exports = { genRandomBytes };
