const passport = require("passport");
const { getCleanName } = require("../helpers/string-helper");
const { validateResults } = require("../helpers/validators");
const User = require("../models/user");
const { genRandomBytes } = require("../utils");
const bcrypt = require("bcrypt");
const {
  getConfirmHtml,
  getForgetHtml,
} = require("../helpers/get-template-html");

const { transporter } = require("../config/nodemailer-config");

const logUser = async (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (err) return next(err);

    if (!user) {
      return res
        .status(401)
        .json({ msg: "El nombre o la contraseña son incorrectos" });
    }
    if (user.state === "unconfirmed") {
      return res.status(401).json({ msg: "unconfirmed" });
    }

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect("/");
    });
  })(req, res, next);
};

const registerUser = async (req, res, next) => {
  //TODO: Validar q los campos solo se envien una vez
  try {
    const result = validateResults(req);

    const { name, username, password, phone, email, lastname, address } =
      req.body;

    const user = {
      name: getCleanName(name),
      lastname: getCleanName(lastname),
      username,
      password,
      phone,
      email,
      address,
    };
    if (!result.isEmpty()) {
      return res.status(400).json(result.array());
    }

    let newUser = new User(user);

    const [hash, randomBytes] = await Promise.all([
      bcrypt.hash(newUser.password, 10),
      genRandomBytes(16),
    ]);

    newUser.password = hash;
    newUser.verifyURL = newUser._id + randomBytes;

    const link = `http://${process.env.URL}/users/verify/${newUser.verifyURL}`;

    const message = {
      from: process.env.MAIL_USER,
      to: req.body.email,
      subject: "Confirme su cuenta",
      text: "Por favor siga el siguiente enlace",
      html: getConfirmHtml(link),
    };

    await newUser.save();

    transporter.sendMail(message).catch((err) => {});
    // await transporter.sendMail(message).catch((err) => {});

    return res.status(200).end();
  } catch (err) {
    console.error(err);
    return res.status(500).end();
    // next(err);
  }
};

const logoutUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    req.logout();
    req.flash("alert alert-success", "Su sessión ha sido cerrada");
    // nombre de dominio
    // let pattern = "8080/";
    // let path = req.headers.referer.split(pattern)[1];
    // res.redirect(`/${path}`);
    res.redirect("/users/login");
  } else {
    next();
  }
};

const sendEmail = async (req, res) => {
  try {
    const { username, password = "" } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(400)
        .json({ msg: "El nombre de usuario o la contraseña son incorrectos" });
    }
    const correct = await bcrypt.compare(password, user.password);

    if (!correct) {
      return res
        .status(400)
        .json({ msg: "El nombre de usuario o la contraseña son incorrectos" });
    }

    const link = `http://${process.env.URL}/users/verify/${user.verifyURL}`;

    const message = {
      from: process.env.MAIL_USER,
      to: user.email,
      subject: "Confirme su cuenta",
      text: "Por favor siga el siguiente enlace",
      html: getConfirmHtml(link),
    };

    transporter.sendMail(message, (err) => {});
    res.end();
  } catch (error) {}
};

module.exports = {
  logUser,
  registerUser,
  logoutUser,
  sendEmail,
};
