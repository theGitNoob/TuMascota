module.exports = (req, res, next) => {
  // if (req.session.user_id) {
  //   req.session.cookie.maxAge = 1800000;
  //   if (req.path == "/login" || req.path == "new") {
  //     res.redirect("/admin");
  //   } else {
  //     next();
  //   }
  // } else {
  //   if (req.path == "/login" || req.path == "/new") {
  //     next();
  //   } else {
  //     res.redirect("/");
  //   }
  // }
  next();
};
