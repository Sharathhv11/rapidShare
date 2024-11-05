import multer from "multer";
import fs from "fs";
import metaDatModel from "../module/fileSchema.js";
import roomModel from "../module/room.js";
import asynchandler from "../utilities/asyncHandler.js";
import CustomError from "./../utilities/customError.js";

//?storing the files received from front end
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

//?initiating the multer
const upload = multer({
  storage: storage,
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

  const data = req.files.map((file) => {
    return {
      filename: file.originalname,
      fileUrl: file.path,
      roomID: room._id,
      fileType: file.mimetype,
      fileSize: file.size / (1024 * 1024) + `MB`,
    };
  });

  await metaDatModel.insertMany(data);

  res.status(201).send({
    status: "success",
    message: "File uploaded successfully and expires in 10mins",
  });
});

export { uploadHandler, uploadsValidator, upload };
