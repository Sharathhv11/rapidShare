import metadata from "../module/fileSchema.js";
import roomModel from "../module/room.js";
import asynchandler from "../utilities/asyncHandler.js";
import CustomError from "../utilities/customError.js";
import { getToken,verifyJwt } from "../utilities/JWT.js";
import metaDatModel from "../module/fileSchema.js";
import jsonwebtoken from "jsonwebtoken"
import fs from "fs"

const handleDownloadValidator = asynchandler(async (req, res, next) => {
  //verify user as sent roomID and password in req.body
  const { roomID, password } = req.body;
  

  // //!if not sent send the error response
  if (!roomID || !password) {
    return next(new CustomError(400, "roomID and password are required"));
  }

  const room = await roomModel.findOne({
    roomID,
  });

  if (!room) {
    return next(
      new CustomError(404, `no room is present with roomID ${roomID}`)
    );
  }

  const validPassword = await room.comparePassword(password);

  if (!validPassword) {
    return next(new CustomError(401, "invalid password"));
  }

  const files = await metaDatModel.find(
    {
      roomID: room,
    },
    {
      _id: 0,
      __v: 0,
    }
  );

  const token = getToken({
    roomID,
    author: room.author,
  });

  const data = files.map((elem) => {
    const { fileUrl } = elem;

    const urlToDOwnloadFile = `${req.protocol}://${req.get(
      "host"
    )}/api/download/${fileUrl.split("\\")[1]}`;

    elem.fileUrl = urlToDOwnloadFile;

    return elem;
  });

  res.send({
    status: "success",
    message: "authenticated to download files",
    token,
    data,
  });
});

const handleDownload = asynchandler(async (req,res,next)=>{

    let token = req.headers.authorization;
    if(token && token.toUpperCase().startsWith("BEARER")){
      token = req.headers.authorization.split(" ")[1];
    }else{
      return next(new CustomError(404,"unauthorized to access the file"))
    }

    if(!token){
      return next(new CustomError(404,"unauthorized to access the file"));
    }

    const decodeJWT = jsonwebtoken.verify(token,process.env.JWT_SIGN)

    

    const {fileName} = req.params;

    if(fs.existsSync(`./uploads/${fileName}`)){
      res.download(`./uploads/${fileName}`,(err) => {
        if(err){
          return next(new CustomError(500,"error while downloading file please try again"))
        }
      });
    }else{
      return next(new CustomError(400,`${fileName} not exists in server`));
    }



})

export { handleDownloadValidator,handleDownload };
