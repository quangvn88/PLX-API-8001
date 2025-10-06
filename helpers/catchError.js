module.exports.catchError = (err, req, res, next) => {
  console.log('catch error')
  let error = new Error("Not found");
  error.status = err.status || 404;
  next(error);
};
