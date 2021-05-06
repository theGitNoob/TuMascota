"@use-strict";
let router = require("express").Router();
let orderModel = require("../../models/order").orderModel;
let fs = require("fs/promises");
let mongoose = require("mongoose");
let multer = require("multer");
var upload = multer({ dest: "./uploads/" });
let petModel = require("../../models/pet").petModel;
let accesoriesModel = require("../../models/accesorie").accesoriesModel;

router.get("/", async (req, res) => {
  try {
    let orders = await orderModel.find().populate("owner");
    res.render("index-ordenes", { ordenes: orders });
  } catch (err) {
    console.error(err);
  }
});

router
  .route("/:id")
  .get(async (req, res) => {})
  .put(async (req, res) => {
    try {
      let order = await orderModel.findById(req.params.id);
      let article =
        order.articleType == "mascota"
          ? await petModel.findById(order.articleId)
          : await accesoriesModel.findById(order.articleId);
      article.stagedCnt -= order.cnt;

      //Actualizar el modelo de productos vendidos

      await order.deleteOne();
      if (article.cnt == 0 && article.stagedCnt == 0) {
        await article.remove();
        console.log("was deleted");
      }
      res.send("Vendido");
    } catch (error) {
      console.error(error);
    }
  })
  .delete(async (req, res) => {
    try {
      let order = await orderModel.findById(req.params.id);
      console.log(req.params.id);
      let article =
        order.articleType == "mascota"
          ? await petModel.findById(order.articleId)
          : await accesoriesModel.findById(order.articleId);

      article.cnt += order.cnt;
      article.stagedCnt -= order.cnt;
      article.available = article.cnt === 0 ? false : true;

      await article.save({ validateModifiedOnly: true });
      await order.deleteOne();
      res.redirect("/admin/ordenes");
    } catch (err) {
      console.error(err);
    }
  });

module.exports = router;
