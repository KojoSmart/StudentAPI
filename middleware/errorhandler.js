// middleware/errorHandler.js

export const errorHandler =(err, req, res, next)=>{
  console.error(err.stack); // show the error in terminal

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Something went wrong.",
    data: null,
    error: err,
  });

}
// module.exports = {errorHandler};
