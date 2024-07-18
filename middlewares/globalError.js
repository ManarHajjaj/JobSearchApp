const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  res.status(err.statusCode).json({
    error: "error",
    message: err.message,
    code: err.statusCode,
    // stack: err.stack,
  });
};
export default globalError;
