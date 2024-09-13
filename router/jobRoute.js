import express from "express";
import authValidator from "../middleware/authMidleware.js";
import JobAapplication from "../controller/jobController.js";

const jobRoute = express.Router();

jobRoute.get("/getjob", authValidator, JobAapplication.getJob);
jobRoute.get("/search", authValidator, JobAapplication.searchJob);
jobRoute.get("/myjob", authValidator, JobAapplication.myJob);
jobRoute.get("/:id", authValidator, JobAapplication.getJobById);
jobRoute.post("/postjob", authValidator, JobAapplication.postJob);
jobRoute.put("/:id", authValidator, JobAapplication.updateJob);
jobRoute.delete("/:id", authValidator, JobAapplication.deleteJob);

export default jobRoute;
