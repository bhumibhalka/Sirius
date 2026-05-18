class ErrorHandler extends Error {
  constructor(message,statusCode){
    super(message);
    this.statusCode = statusCode;

     Error.captureStackTrace(this, this.constructor);
  }
}

export const errorMiddleware = (err,req,res,next) => {
  const message = err.message || "Something went wrong";

  const statusCode = err.statusCode || 500;

  res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
  res.header("Access-Control-Allow-Credentials", "true");
  
  res.status(statusCode).json({
    success: true,
    message,
  })

}

export default ErrorHandler;