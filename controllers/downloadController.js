import metadata from "../module/fileSchema.js";
import roomModel from "../module/room.js";
import asynchandler from "../utilities/asyncHandler.js";
import CustomError from "../utilities/customError.js";
import { getToken, verifyJwt } from "../utilities/JWT.js";
import metaDatModel from "../module/fileSchema.js";
import jsonwebtoken from "jsonwebtoken";
import supabase from "../config/supabase.js";

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

    const urlToDOwnloadFile = `https://${req.get(
      "host"
    )}/api/download/${fileUrl}`;

    elem.fileUrl = urlToDOwnloadFile;

    elem.roomID = roomID;

    return elem;
  });

  res.send({
    status: "success",
    message: "authenticated to download files",
    token,
    data,
  });
});

const handleDownload = asynchandler(async (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.toUpperCase().startsWith("BEARER")) {
    token = req.headers.authorization.split(" ")[1];
  } else {
    return next(new CustomError(404, "unauthorized to access the file"));
  }

  if (!token) {
    return next(new CustomError(404, "unauthorized to access the file"));
  }

  const decodeJWT = jsonwebtoken.verify(token, process.env.JWT_SIGN);

  const { fileName } = req.params;

  try {
    // Download the file from Supabase Storage
    const { data, error } = await supabase.storage
      .from("Rapid-Share")
      .download(fileName);

    if (error) {
      return res.status(500).send("Failed to download file. Please try again");
    } else if (!data) {
      return res.status(404).send("File not exists in our server");
    }

    // Set response headers for downloading the file
    res.setHeader("Content-Type", data.type); // Dynamic MIME type
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileName.split("/").pop()}"`
    );
    res.setHeader("Content-Length", data.size);

    // Stream the file to the response
    const buffer = Buffer.from(await data.arrayBuffer());
    res.send(buffer);
  } catch (err) {
    return res.status(500).send("An error occurred while downloading the file");
  }
});

export { handleDownloadValidator, handleDownload };
