import express from "express";
import coldMailController from "../controller/coldmailControlller.js";
import userRoute from "./userRoute.js";
import jobRoute from "./jobRoute.js";
import applicationRoute from "./applicationRoute.js";

const router = express.Router();

router.use("/auth", userRoute);
router.use("/job", jobRoute);
router.use("/application", applicationRoute);

router.post("/coldmail", coldMailController);
export default router;
