// error handler
function errorHandler(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  console.error(err);
  //   res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("500");
}

module.exports = errorHandler;
