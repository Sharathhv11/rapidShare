import multer from "multer";
import fs from "fs";
import metaDatModel from "../module/fileSchema.js";
import roomModel from "../module/room.js";
import asynchandler from "../utilities/asyncHandler.js";
import CustomError from "./../utilities/customError.js";
import supabaseClient from "./../config/supabase.js";

/*******



//?storing the files received from front end
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./uploads");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + "-" + file.originalname);
//   },
// });



******/

const storage = multer.memoryStorage();

//?initiating the multer
const upload = multer({
  storage,
});

//validating the files
const uploadsValidator = (req, res, next) => {
  //?computing the total size of the files
  const totalSize = req.files.reduce((a, currentObj) => {
    return a + currentObj.size;
  }, 0);

  //!if total file size exceeds more than 100 mb send bad requests
  if (totalSize / (1024 * 1024) > 100) {
    return next(new CustomError(400, "files exceeds more than 100mb"));
  }

  next();
};

//?handler that stores the meta inormation of the files of room
const uploadHandler = asynchandler(async (req, res, next) => {
  req.uploadError = true;
  //*extracting the required feilds from body
  const { roomID, password, author } = req.body;

  if (!roomID || !password) {
    return next(new CustomError(400, "roomID and password are required"));
  }

  const isExists = await roomModel.findOne({
    roomID,
  });

  //*if room exists send bad response
  if (isExists) {
    return next(new CustomError(400, "room already exists"));
  }

  const room = await roomModel.create({
    roomID: roomID,
    password,
    author,
  });

  const dataToUpload = req.files.map(async (file) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const { data, error } = await supabaseClient.storage
      .from("Rapid-Share")
      .upload(`${uniqueSuffix + "-" + file.originalname}`, file.buffer, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      next(new CustomError(500, "our servers are running downtime try again"));
    }

    

    return {
      filename: file.originalname,
      fileUrl: data.path,
      roomID: room._id,
      fileType: file.mimetype,
      fileSize: file.size / (1024 * 1024) + `MB`,
    };
  });

  Promise.all(dataToUpload).then(async  data => {
     await metaDatModel.insertMany(data);
  })



  res.status(201).send({
    status: "success",
    message: "File uploaded successfully and expires in 10mins",
  });
});

export { uploadHandler, uploadsValidator, upload };
