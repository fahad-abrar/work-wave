import Job from "../model/jobSchema.js";
import User from "../model/userSchema.js";
import ErrorHandler from "../middleware/errorHandler.js";

class JobAapplication {
  static async getJob(req, res, next) {
    try {
      // find all the job
      const allJob = await Job.find();

      // check the job is retrieve or not
      if (allJob.length === 0) {
        return next(new ErrorHandler("job is not found", 404));
      }
      // calculate the total no of job
      const noOfJob = allJob.length;

      // send the response
      return res.status(200).json({
        success: true,
        message: "job is retrieved",
        noOfJob: noOfJob,
        job: allJob,
      });
    } catch (err) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
  static async getJobById(req, res, next) {
    try {
      const { id } = req.params;

      // check if the job is exist or not
      const findJob = await Job.findById(id);
      if (!findJob) {
        return next(new ErrorHandler("job is not found", 404));
      }

      // send the response
      return res.status(200).json({
        success: true,
        message: "job is retrieved",
        job: findJob,
      });
    } catch (err) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
  static async postJob(req, res, next) {
    try {
      const {
        title,
        jobType,
        location,
        companyName,
        introduction,
        responsibilities,
        qualifications,
        offers,
        salary,
        hiringMultipleCandidates,
        personalWebsiteTitle,
        personalWebsiteUrl,
        jobNiche,
        newsLetterSend,
        postedBy,
      } = req.body;

      // check if all data is provided or not
      if (
        !title ||
        !jobType ||
        !location ||
        !companyName ||
        !introduction ||
        !responsibilities ||
        !qualifications ||
        !salary ||
        !jobNiche
      ) {
        return res.status(400).json({
          success: false,
          message: "all fields are required",
        });
      }
      // check if the user has personal website
      if (
        (personalWebsiteTitle && !personalWebsiteUrl) ||
        (!personalWebsiteTitle && personalWebsiteUrl)
      ) {
        return next(new ErrorHandler(" job title and url is required", 404));
      }
      // check if the user is eauthenticate or not
      const findUser = await User.findById(req.user.id);
      if (!findUser) {
        return next(new ErrorHandler(" user is not found", 404));
      }

      // check if the user is authorised for the post
      if (findUser.workAs !== "admin" && findUser.workAs !== "employe") {
        return res.status(400).json({
          success: false,
          message: "only admin or employe can post for the job",
        });
      }
      // collect all the data for creating the post
      const jobData = {
        title,
        jobType,
        location,
        companyName,
        companyName,
        responsibilities,
        qualifications,
        offers,
        salary,
        hiringMultipleCandidates,
        personalWebsite: {
          title: personalWebsiteTitle,
          url: personalWebsiteUrl,
        },
        jobNiche,
        newsLetterSend,
        postedBy: user.id,
      };

      // create the job
      const job = await Job.create(jobData);

      // send the response
      return res.status(201).json({
        success: true,
        message: "job created successfully",
        job: job,
      });
    } catch (err) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
  static async updateJob(req, res, next) {
    try {
      const { id } = req.params;
      const { personalWebsiteTitle, personalWebsiteUrl, ...rest } = req.body;

      // check if the user is exist or not
      const findJob = await Job.findById(id);
      if (!findJob) {
        return next(new ErrorHandler("job is not found", 404));
      }

      //find the auth user of the post
      const authUser = await User.findById(req.user.id);

      // only allow the job poster update the job
      if (findJob.postedBy.toString() !== authUser.id) {
        return next(
          new ErrorHandler("only job poster can update the job", 404)
        );
      }

      // check if the user has personal website
      if (
        (personalWebsiteTitle && !personalWebsiteUrl) ||
        (!personalWebsiteTitle && personalWebsiteUrl)
      ) {
        return next(
          new ErrorHandler("website title and url both are required", 404)
        );
      }

      // setup the skeleton
      const updateData = {
        ...rest,
      };

      if (personalWebsiteTitle && personalWebsiteUrl) {
        updateData.personalWebsite = {
          title: personalWebsiteTitle,
          url: personalWebsiteUrl,
        };
      }

      // update the job post
      const updateJob = await Job.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      // send the response
      return res.status(200).json({
        success: true,
        message: "job is updated",
        job: updateJob,
      });
    } catch (err) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
  static async deleteJob(req, res, next) {
    try {
      const { id } = req.params;

      // find the job
      const findJob = await Job.findById(id);
      if (!findJob) {
        return next(new ErrorHandler("job is not found", 404));
      }

      // find the auth user of the job
      const authUser = await User.findById(req.user.id);

      // determine if the user is the job poster or an admin
      const isJobPoster = findJob.postedBy.toString() === authUser.id;
      const isAdmin = authUser.workAs === "admin";

      // only allow the job poster or an admin to update the job
      if (!isJobPoster && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: "Only the job poster or an admin can update this job",
        });
      }

      // delete the job
      await Job.deleteOne({ _id: id });

      // send the response
      return res.status(200).json({
        success: true,
        message: "job is deleted",
        job: findJob,
      });
    } catch (err) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
  static async searchJob(req, res, next) {
    try {
      const { city, niche, srcKeyword, page = 1, limit = 2 } = req.query;

      // define a object to store to query
      const query = {};

      //handleing  query to search the result
      if (city) {
        query.location = city;
      }
      if (niche) {
        query.jobNiche = niche;
      }
      if (srcKeyword) {
        query.$or = [
          { title: { $regex: srcKeyword, $options: "i" } },
          { companyName: { $regex: srcKeyword, $options: "i" } },
          { introduction: { $regex: srcKeyword, $options: "i" } },
        ];
      }
      // appling condition to get positive number
      if (page < 0) {
        page = 1;
      }
      if (limit < 0) {
        limit = 1;
      }
      // define a number of job to skip
      const skip = (page - 1) * limit;

      //find the job using the query
      const findJob = await Job.find(query)
        .limit(parseInt(page))
        .skip(parseInt(skip));

      if (findJob.length === 0) {
        return next(new ErrorHandler("job is not found", 404));
      }
      // find the total no of jobs and page are available
      const totalJobs = await Job.countDocuments(query);
      const totalPage = Math.ceil(totalJobs / limit);

      // define a object to return
      const jobDetails = {
        jobs: totalJobs,
        Pages: totalPage,
        currentPage: page,
        job: findJob,
      };

      return res.status(200).json({
        success: true,
        message: " job is retrieved",
        job: jobDetails,
      });
    } catch (err) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
  static async myJob(req, res, next) {
    try {
      // retrieve the authenticated user
      const authUser = req.user;

      // check if the user is exist or not
      const findJob = await Job.find({ postedBy: authUser.id });
      if (findJob.length === 0) {
        return next(new ErrorHandler("job is not found", 404));
      }

      // send the response
      return res.status(200).json({
        success: true,
        message: " job is retrieved",
        jobs: findJob,
      });
    } catch (err) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
}

export default JobAapplication;
