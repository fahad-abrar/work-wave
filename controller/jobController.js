import Job from '../model/jobSchema.js'
import User from '../model/userSchema.js'

class JobAapplication{

    static async getJob( req, res ){
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

    static async getJobById( req, res ){
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

    static async  postJob(req, res){
        try{
        const {title,jobType, location, companyName, introduction, responsibilities, qualifications, offers, salary,hiringMultipleCandidates, personalWebsiteTitle, personalWebsiteUrl, jobNiche, newsLetterSend, postedBy} = req.body

        if( !title || !jobType || !location || !companyName || !introduction || !responsibilities || !qualifications || !salary || !jobNiche ){
            return res.status(400).json({
                success: false,
                message: 'all fields are required'
            })
        }
        if(( personalWebsiteTitle && !personalWebsiteUrl ) || ( !personalWebsiteTitle && personalWebsiteUrl )){
            return res.status(400).json({
                success: false,
                message: 'website title and url both are required'
            })
        }
        const user = req.user

        if(!user){
            return res.status(400).json({
                success: false,
                message: 'unauthorized to post the job'
            })
        }
        const findUser = await User.findById(user.id)
        if(!findUser){
            return res.status(400).json({
                success: false,
                message: 'user not found in databse to post the job'
            })
        }

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

        const job = await Job.create(jobData)
        console.log(job)
        return res.status(201).json({
            success: true,
            message: 'job created successfully',
            job
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

}

export default JobAapplication