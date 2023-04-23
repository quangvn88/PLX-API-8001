module.exports.handleError = (error, req, res, next) => {
  const status = (error.status || 500)
  res.status(status);

  if (status == 404) {
    res.render("pages/404.pug");
    return;
  }

  res.json({
    message: error.message,
  });
};
