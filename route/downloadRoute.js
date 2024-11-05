import {Router} from "express"
import { handleDownloadValidator,handleDownload } from "../controllers/downloadController.js";

const downloadRoute = new Router();

downloadRoute.route("/").post(handleDownloadValidator);
downloadRoute.route("/:fileName").get(handleDownload);

export default downloadRoute;