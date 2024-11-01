import multer from "multer";
import fs from "fs";
import sessionModel from "../module/fileSchema.js";
import bcryptjs from "bcryptjs";

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

    res.send("file size exceeded more than 100mb");
  } else {
    next();
  }
};

const uploadHandler = async (req, res) => {
  try {
    const { roomID, password } = req.body;

    if (!roomID || !password) {
      return res
        .status(400)
        .json({ message: "roomID and password are required" });
    }

    const hashedPassword = await bcryptjs.hash(password, 12);

    const data = req.files.map((file) => {
      return {
        fileUrl: file.path,
        roomID: roomID,
        password: hashedPassword,
        author: req.body.author,
        fileType: file.mimetype,
        fileSize: file.size / (1024 * 1024) + `MB`
      };
    });

    await sessionModel.insertMany(data);

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
