import {Router} from "express"
import { handleDownload } from "../controllers/downloadController.js";

const downloadRoute = new Router();

downloadRoute.route("/").post(handleDownload);

export default downloadRoute;