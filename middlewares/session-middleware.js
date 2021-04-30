module.exports = (req, res, next) => {
  // evitar q usuarios ya registrados puedan acceder a paginas de logeo y registro

  if (req.session.user_id != undefined) {
    if (
      req.path.startsWith("/users/sign_in") ||
      req.path.startsWith("/users/sign_up")
    ) {
      res.redirect("/");
      return;
    } else if (req.path.includes("/admin")) {
      // if (req.session.user_role != "admin") {
      //   res.status(404).send("Los sentimos esta página no existe");
      //   return;
      // }
      next();
      return;
    }
  } else {
    if (req.path.includes("/admin")) {
      // res.send(404, "Los sentimos esta página no existe");
      // return;
      next();
      return;
    }
  }
  next();
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
};
