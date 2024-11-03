class CustomError extends Error{
    constructor(statusCode,message){
        super(message);

        this.statusCode = statusCode;
        this.status = (statusCode >=400 && statusCode <500)?"failed":"error";
        this.isOperational = true;

        Error.captureStackTrace(this,CustomError);
    }
}


export default CustomError;