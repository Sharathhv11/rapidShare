import express from "express"
import {uploadHandler,uploadsValidator,upload} from "./../controllers/uploadController.js"
const uploadRoute = new express.Router();


uploadRoute.route("/").post(upload.array("files",5),uploadsValidator,uploadHandler);



export default uploadRoute;