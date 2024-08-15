import Job from '../model/jobSchema.js'
import User from '../model/userSchema.js'

class JobAapplication{

    static async getJob( req, res ){
        try {
            // find all the job
            const allJob = await Job.find()

            // check the job is retrieve or not
            if(allJob.length === 0){
                return res.status(400).json({
                    success: true,
                    message: 'job is not found'
                })
            }
            const noOfJob = allJob.length

            return res.status(200).json({
                success: true,
                message: 'job is retrieved',
                noOfJob:noOfJob,
                job: allJob
            })

        } catch (err) {
            console.log(err)
            return res.status(400).json({
                success: false,
                message: err.message
            })
        }
    }

    static async getJobById( req, res ){
        try {
            const { id } = req.params

            // find the job
            const findJob = await Job.findById( id )

            if(!findJob){
                return res.status(200).json({
                    success: false,
                    message: 'job is not found'
                })
            }

            return res.status(200).json({
                success: true,
                message: 'job is retrieved',
                job: findJob
            })

        } catch (err) {
            console.log(err)
            return res.status(400).json({
                success: false,
                message: err.message
            })
        }
    }

    static async  postJob(req, res){
        try{
        const {title,jobType, location, companyName, introduction, responsibilities, qualifications, offers, salary,hiringMultipleCandidates, personalWebsiteTitle, personalWebsiteUrl, jobNiche, newsLetterSend, postedBy} = req.body

        // check if all data is provided or not
        if( !title || !jobType || !location || !companyName || !introduction || !responsibilities || !qualifications || !salary || !jobNiche ){
            return res.status(400).json({
                success: false,
                message: 'all fields are required'
            })
        }
        // check if the user has personal website 
        if(( personalWebsiteTitle && !personalWebsiteUrl ) || ( !personalWebsiteTitle && personalWebsiteUrl )){
            return res.status(400).json({
                success: false,
                message: 'website title and url both are required'
            })
        }
        // retrieve the  authorized user
        const user = req.user

        if(!user){
            return res.status(400).json({
                success: false,
                message: 'unauthorized to post the job'
            })
        }

        // find the user from the data base
        const findUser = await User.findById(user.id)
        if(!findUser){
            return res.status(400).json({
                success: false,
                message: 'user not found in databse to post the job'
            })
        }
        // check if the user is authorised for the post
        if((findUser.workAs !== 'admin') && (findUser.workAs !== 'employe')){
            return res.status(400).json({
                success: false,
                message: 'only admin or employe can post for the job'
            })
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
            personalWebsite:{
                title: personalWebsiteTitle,
                url: personalWebsiteUrl
            },
            jobNiche, 
            newsLetterSend,
            postedBy:user.id
        }

        // create the job
        const job = await Job.create(jobData)
        
        return res.status(201).json({
            success: true,
            message: 'job created successfully',
            job: job
        })
        }catch(err){
            console.log(err)
            return res.status(400).json({
                success: false,
                message: err.message
            })
        }
    }

    static async updateJob( req, res ){
        try {





            return res.status(200).json({
                success: true,
                message: ''
            })

        } catch (err) {
            console.log(err)
            return res.status(400).json({
                success: false,
                message: err.message
            })
        }
    }

    static async deleteJob( req, res ){
        try {
            const { id } = req.params

            // find the job
            const findJob = await Job.findById( id )

            if(!findJob){
                return res.status(200).json({
                    success: false,
                    message: 'job is not found'
                })
            }

            // delete the job
            await Job.deleteOne({ _id : id })

            return res.status(200).json({
                success: true,
                message: 'job is deleted',
                job: findJob
            })

        } catch (err) {
            console.log(err)
            return res.status(500).json({
                success: false,
                message: err.message
            })
        }
    }

}

export default JobAapplication