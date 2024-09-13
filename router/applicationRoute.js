import express from "express";
import authValidator from "../middleware/authMidleware.js";
import multerUploader from "../utils/fileHandler.js";
import ApplicationCntlr from "../controller/applicationController.js";

const applicationRoute = express.Router();

applicationRoute.post(
  "/post/:id",
  multerUploader,
  authValidator,
  ApplicationCntlr.postApp
);
applicationRoute.put(
  "/update/:id",
  multerUploader,
  authValidator,
  ApplicationCntlr.updateApp
);
applicationRoute.get("/poster", authValidator, ApplicationCntlr.getPosterApp);
applicationRoute.get(
  "/jobseeker",
  authValidator,
  ApplicationCntlr.getJobSeekerApp
);
applicationRoute.delete(
  "/delete/:id",
  authValidator,
  ApplicationCntlr.deleteApp
);

export default applicationRoute;
