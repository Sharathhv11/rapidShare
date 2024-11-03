
const asynchandler = (fx) =>{
    return (req,res,next) => {
        fx(req,res,next).catch(error => next(error));
    }
}

export default asynchandler;


