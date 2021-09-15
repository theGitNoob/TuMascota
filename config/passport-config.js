let passport = require("passport");
let LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user-model");
const bcrypt = require("bcrypt");
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id, ["-__v", "-password"]).exec();
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username }).exec();

      if (!user) return done(null, false);

      const res = await bcrypt.compare(password, user.password);

      if (res) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err);
    }
  })
);

module.exports;
