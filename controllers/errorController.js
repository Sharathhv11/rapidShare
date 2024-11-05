import CustomError from "../utilities/customError.js";
import fileDeleter from "../utilities/fileDeleter.js";

const sendErrorResponse = (error, res) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    res.status(500).send({
      status: "failed",
      message: "something went wrong please try again",
    });
  }
};


const handleExpiredJwt = () => {
    const message = `JWT token has been expired`;
  return new CustomError(400,message);
}

const validationError = (error) => {
  const errors = Object.values(error.errors).map((e) => {
    return `${e.path} "${e.value}" exceeds the allowed maximum length of ${e.properties.maxlength} characters.`;
  });

  return new CustomError(400, errors);
};


const handelJwtError = () => {
    const message = `Invalid Token Please login again`;
    return new CustomError(400,message);
  };

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "error";

  if (err.name === "ValidationError") {
    err = validationError(err);
  }

  if (req.uploadError) {
    fileDeleter(req.files);
  }
  else  if (err.name === "TokenExpiredError") {
    err = handleExpiredJwt();
  }
  else  if (err.name === "JsonWebTokenError") {
    err = handelJwtError();
  }

  sendErrorResponse(err, res);
};

export default globalErrorHandler;
