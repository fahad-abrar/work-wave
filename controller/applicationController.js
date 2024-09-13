import User from "../model/userSchema.js";
import Job from "../model/jobSchema.js";
import Application from "../model/applicationSchema.js";
import ErrorHandler from "../middleware/errorHandler.js";

class ApplicationCntlr {
  static async postApp(req, res, next) {
    try {
      const { id } = req.params;

      const { name, email, phone, address, coverLetter, role } = req.body;

      // check all the required field
      if (!name || !email || !phone || !address || !coverLetter) {
        return next(new ErrorHandler("all fields are required", 404));
      }
      // // check is the user is applied or not
      const isApplied = await Application.find({
        "jobSeekerInfo.id": req.user.id,
        "jobInfo.jobId": id,
      });

      if (isApplied.length !== 0) {
        return next(new ErrorHandler("already applied this job", 400));
      }

      // retrieve the authoerized user
      const authUser = await User.findById(req.user.id);

      if (authUser.workAs !== "jobSeeker") {
        return next(
          new ErrorHandler("only job seeker can apply fro the job", 400)
        );
      }
      // find the jon details
      const jobDetails = await Job.findById(id);
      if (!jobDetails) {
        return next(new ErrorHandler("job is not found", 404));
      }

      const jobid = jobDetails.postedBy.toString();

      // find the poster dertails
      const employeDetails = await User.findById(jobid);
      console.log("employe details ----", employeDetails);

      let public_id = null;
      let url = null;

      // handle the resume
      if (req.files && req.files.resume) {
        console.log(req.files.resume[0].filename);

        public_id = req.files.resume[0].filename;
        url = req.files.resume[0].path;
      } else if (authUser.resume) {
        public_id = authUser.resume.public_id;
        url = authUser.resume.url;
      } else {
        return res.status(404).json({
          success: false,
          message: "Resume is required for job application",
        });
      }

      // create a object for storing the data
      const appObject = {
        jobSeekerInfo: {
          id: req.user.id,
          name,
          email,
          phone,
          address,
          role: authUser.workAs,
          coverLetter,
          resume: {
            public_id,
            url,
          },
        },

        jobInfo: {
          jobId: jobDetails.id,
          jobTitle: jobDetails.title,
        },
        employerInfo: {
          id: employeDetails.id,
          role: employeDetails.workAs,
        },
      };

      // create a data base to store to application
      const jobApp = await Application.create(appObject);

      return res.status(200).json({
        success: true,
        message: "appling the job is successfully",
        job: jobApp,
      });
    } catch (err) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
  static async updateApp(req, res, next) {
    try {
      const { id } = req.params;

      const { name, email, phone, ...rest } = req.body;

      // retrieve the application by id
      const findApp = await Application.findById(id);
      if (!findApp) {
        return next(new ErrorHandler("application is not found", 404));
      }

      // retrieve the authenticated user
      const authUser = await User.findById(req.user.id);

      // ensure the authenticated user is the one who created the application
      if (findApp.jobSeekerInfo.id.toString() !== req.user.id) {
        return next(
          new ErrorHandler("auth user only update this application", 404)
        );
      }

      // check is the user is job seeker or not
      if (authUser.workAs !== "jobSeeker") {
        return next(
          new ErrorHandler("only job seeker can update this application", 404)
        );
      }

      let public_id = findApp.jobSeekerInfo.resume.public_id;
      let url = findApp.jobSeekerInfo.resume.url;

      // handle the resume
      if (req.files && req.files.resume) {
        public_id = req.files.resume[0].filename;
        url = req.files.resume[0].path;
      } else if (!public_id || !url) {
        return res.status(404).json({
          success: false,
          message: "resume is required for updating the application",
        });
      }

      // update the application object
      const updateData = {
        ...rest,
        jobSeekerInfo: {
          ...findApp.jobSeekerInfo,
          ...rest,
          resume: {
            public_id,
            url,
          },
        },
      };

      // save the updated application to the database
      const updateApp = await Application.findByIdAndUpdate(id, updateData, {
        new: true,
      });
      console.log(updateApp);

      return res.status(200).json({
        success: true,
        message: "Application updated successfully",
        application: updateApp,
      });
    } catch (err) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
  static async getPosterApp(req, res, next) {
    try {
      const authuser = req.user;

      // find the poster job application
      const findApp = await Application.find({
        "employerInfo.id": authuser.id,
      });

      if (findApp.length === 0) {
        return next(new ErrorHandler("application is not found", 404));
      }

      return res.status(200).json({
        success: true,
        message: "job is retrieved",
        application: findApp,
      });
    } catch (err) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
  static async getJobSeekerApp(req, res, next) {
    try {
      const authuser = req.user;

      // find the poster job application
      const findApp = await Application.find({
        "jobSeekerInfo.id": authuser.id,
      });

      if (findApp.length === 0) {
        return next(new ErrorHandler("application is not found", 404));
      }

      return res.status(200).json({
        success: true,
        message: "application is retrieved",
        application: findApp,
      });
    } catch (err) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
  static async deleteApp(req, res, next) {
    try {
      const { id } = req.params;
      const findApp = await Application.findById(id);
      if (!findApp) {
        return next(new ErrorHandler("application is not found", 404));
      }
      const authUser = await User.findById(req.user.id);

      const role = authUser.workAs;

      switch (role) {
        case "employe":
          findApp.deletedBy.employe = true;
          break;

        case "jobSeeker":
          findApp.deletedBy.jobSeeker = true;
          break;

        default:
          return res.status(403).json({
            success: false,
            message: "Unauthorized action",
          });
      }
      await findApp.save();

      if (
        findApp.deletedBy.employe === true &&
        findApp.deletedBy.jobSeeker === true
      ) {
        findApp.deleteOne();
      }

      return res.status(200).json({
        success: true,
        message: "application has been deleted",
        job: findApp,
      });
    } catch (err) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
}

export default ApplicationCntlr;
