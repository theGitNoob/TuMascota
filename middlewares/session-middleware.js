const checkAuth = (req, res, next) => {
  if (!req.isAuthenticated()) return res.redirect("/users/login");

  return next();
};
const noAuth = (req, res, next) => {
  if (req.isAuthenticated()) return res.redirect("/");

  return next();
};

module.exports = { checkAuth, noAuth };
