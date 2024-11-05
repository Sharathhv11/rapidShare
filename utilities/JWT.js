import jsonwebtoken from "jsonwebtoken";


function getToken(data){
    return jsonwebtoken.sign(data,process.env.JWT_SIGN,{
        expiresIn:"10m"
    })
}

function verifyJwt(token){
    return jsonwebtoken.verify(token,process.env.JWT_SIGN);
}

export {getToken,verifyJwt};