import User from '../model/userSchema.js'
import Job from '../model/jobSchema.js'
import Application from '../model/applicationSchema.js'
import { application } from 'express'

class ApplicationCntlr{

    static async postApp(req, res){

        try {
            const { id } = req.params

            const {name, email, phone, address, coverLetter, role,
            } = req.body

            // check all the required field
            if(!name || !email || !phone || !address ||!coverLetter){
                return res.status(400).json({
                    success: true,
                    message: 'all the fields are required',
                })
            }
            // // check is the user is applied or not
            const isApplied = await Application.find({
                'jobSeekerInfo.id': req.user.id,
                'jobInfo.jobId': id
            })

            if(isApplied.length !== 0){
                return res.status(400).json({
                    success: false,
                    message: 'user has already applied',
                })
            }

            // retrieve the authoerized user
            const authUser = await User.findById(req.user.id)

            if(authUser.workAs !== 'jobSeeker'){
                return res.status(400).json({
                    success: false,
                    message: 'only jobseeker can apply the job',
                })
            }
            // find the jon details
            const jobDetails = await Job.findById( id )
            if(!jobDetails){
                return res.status(404).json({
                    success: false,
                    message: 'job is not found',
                })
            }

            const jobid = jobDetails.postedBy.toString()

            // find the poster dertails
            const employeDetails = await User.findById(jobid)

            console.log('employe details ----', employeDetails)

            let public_id = null
            let url = null

            // handle the resume
            if (req.files && req.files.resume) {
                console.log(req.files.resume[0].filename)
                public_id = req.files.resume[0].filename;
                url = req.files.resume[0].path;
            } else if (authUser.resume) {
                public_id = authUser.resume.public_id;
                url = authUser.resume.url;
            } else {
                return res.status(404).json({
                    success: false,
                    message: 'Resume is required for job application',
                });
            }
            
            // create a object for storing the data 
            const appObject ={
                jobSeekerInfo : {
                    id : req.user.id,
                    name,
                    email,
                    phone,
                    address,
                    role: authUser.workAs,
                    coverLetter,
                    resume:{
                        public_id,
                        url
                    }
                },

                jobInfo:{
                    jobId: jobDetails.id,
                    jobTitle: jobDetails.title

                },
                employerInfo:{
                    id: employeDetails.id,
                    role: employeDetails.workAs,

                }

            }

            // create a data base to store to application
            const jobApp = await Application.create(appObject)


            return res.status(200).json({
                success: true,
                message: 'appling the job is successfully',
                job: jobApp
            })

        } catch (err) {
            console.log(err)
            return res.status(400).json({
                success: false,
                message: err.message
            })
        }
    }

    static async updateApp(req, res) {
        try {
            const { id } = req.params
    
            const { 
                name, 
                email, 
                phone, 
                ...rest} = req.body;
        
            // retrieve the application by id
            const findApp = await Application.findById(id);
            if (!findApp) {
                return res.status(404).json({
                    success: false,
                    message: 'Application not found',
                });
            }

            console.log('findappp ---->>>>',findApp)
    
            // ensure the authenticated user is the one who created the application
            if (findApp.jobSeekerInfo.id.toString() !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: 'only authorized user can update the application',
                });
            }
    
            // retrieve the authenticated user
            const authUser = await User.findById(req.user.id);
    
            if (authUser.workAs !== 'jobSeeker') {
                return res.status(404).json({
                    success: false,
                    message: 'only job seekers can update the application',
                });
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
                    message: 'resume is required for updating the application',
                });
            }
    
            // update the application object
            const updateData = {
                ...rest,
                jobSeekerInfo:{
                    ...findApp.jobSeekerInfo,
                    ...rest,
                    resume: {
                        public_id,
                        url
                    }
                }
            };
    
            // save the updated application to the database
            const updateApp = await Application.findByIdAndUpdate( id, updateData, {
                new: true
            })
            console.log(updateApp)
    
            return res.status(200).json({
                success: true,
                message: 'Application updated successfully',
                application: updateApp 
            });
    
        } catch (err) {
            console.log(err);
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }
    }  
    
    static async getPosterApp( req, res ){
        try {
            const authuser = req.user
            
            // find the poster job application
            const findApp = await Application.find({
                'employerInfo.id': authuser.id
            })

            if(findApp.length === 0){
                return res.status(404).json({
                    success: false,
                    message:'no application found'
                })
            }

            return res.status(200).json({
                success: true,
                message: 'job is retrieved',
                application: findApp
            })

        } catch (err) {
            console.log(err)
            return res.status(400).json({
                success: false,
                message: err.message
            })
        }
    }

    static async getJobSeekerApp( req, res ){
        try {
            const authuser = req.user
            
            // find the poster job application
            const findApp = await Application.find({
                'jobSeekerInfo.id': authuser.id
            })

            if(findApp.length === 0){
                return res.status(404).json({
                    success: false,
                    message:'no application found'
                })
            }

            return res.status(200).json({
                success: true,
                message: 'application is retrieved',
                application: findApp
            })

        } catch (err) {
            console.log(err)
            return res.status(400).json({
                success: false,
                message: err.message
            })
        }
    }

    static async deleteApp( req, res ){
        try {
            const { id } = req.params
            const findApp = await Application.findById(id)
            if(!findApp){
                return res.status(404).json({
                    success: false,
                    message:'application is not found'
                })
            }
            const authUser = await User.findById(req.user.id)

            const role = authUser.workAs

            switch(role){
                case 'employe':
                    findApp.deletedBy.employe = true
                    break
                
                case 'jobSeeker':
                    findApp.deletedBy.jobSeeker = true
                    break

                default:
                    return res.status(403).json({
                        success: false,
                        message: 'Unauthorized action'
                    })
            }
            await findApp.save()

            if(findApp.deletedBy.employe === true && findApp.deletedBy.jobSeeker === true ){
                findApp.deleteOne()
            }


            return res.status(200).json({
                success: true,
                message: 'application has been deleted',
                job: findApp
            })

        } catch (err) {
            console.log(err)
            return res.status(400).json({
                success: false,
                message: err.message
            })
        }
    }

}

export default ApplicationCntlr



