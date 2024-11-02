import multer from "multer";
import fs from "fs";
import metaDatModel from "../module/fileSchema.js";
import roomModel from "../module/room.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const uploadsValidator = (req, res, next) => {
  const totalSize = req.files.reduce((a, currentObj) => {
    return a + currentObj.size;
  }, 0);

  if (totalSize / (1024 * 1024) > 100) {
    req.files.forEach((file) => {
      fs.unlinkSync(file.path);
    });

    res.status(400).send({
      status: "failed",
      message: "files exceed more than 100MB",
    });
  } else {
    next();
  }
};

const uploadHandler = async (req, res) => {
  try {
    const { roomID, password, author } = req.body;

    if (!roomID || !password) {
      req.files.forEach((file) => {
        fs.unlinkSync(file.path);
      });
      return res
        .status(400)
        .json({ message: "roomID and password are required" });
    }

    const isExists = await roomModel.findOne({
      roomID
    });

    if(isExists){
      req.files.forEach((file) => {
        fs.unlinkSync(file.path);
      });
      return res.status(400).send({
        status: "failed",
        message: "room already exists",
      })
    }

    const room = await roomModel({
      roomID: roomID,
      password,
      author
    });

    room.save();

    const data = req.files.map((file) => {
      return {
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
  } catch (error) {
    req.files.forEach((file) => {
      fs.unlinkSync(file.path);
    });

    res.status(400).send({
      status: "failed",
      message: error.message,
    });
  }
};

export { uploadHandler, uploadsValidator, upload };
