let router = require("express").Router();

router.get("/servicios", (req, res, next) => {
  res.render("servicios");
});
