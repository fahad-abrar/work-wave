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
            const { id } = req.params
            const {
             
                personalWebsiteTitle, 
                personalWebsiteUrl,
                ...rest
            
            } = req.body;

            // find the job 
            const findJob = await Job.findById( id )
            console.log(findJob)
            
            if(!findJob){
                return res.status(400).json({
                    success: false,
                    message: 'job is not found'
                })
            }

            //find the auth user of the post
            const authUser = await User.findById(req.user.id)
        
            // only allow the job poster update the job
            if (findJob.postedBy.toString() !== authUser.id) {
                return res.status(403).json({
                    success: false,
                    message: 'Only the job poster is authorized to update'
                });
            }

            // check if the user has personal website 
            if(( personalWebsiteTitle && !personalWebsiteUrl ) || ( !personalWebsiteTitle && personalWebsiteUrl )){
                return res.status(400).json({
                    success: false,
                    message: 'website title and url both are required'
                })
            }

            // Prepare the data for update
            const updateData = {
                ...rest,
            }

            if (personalWebsiteTitle && personalWebsiteUrl) {
                updateData.personalWebsite = {
                    title: personalWebsiteTitle,
                    url: personalWebsiteUrl,
                };
            }
                  
            const updateJob = await Job.findByIdAndUpdate(id, updateData,{
                new: true
            })
            return res.status(200).json({
                success: true,
                message: 'job is updated',
                job: updateJob
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

            // find the auth user of the job
            const authUser  = await User.findById(req.user.id)

            // determine if the user is the job poster or an admin
            const isJobPoster = findJob.postedBy.toString() === authUser.id;
            const isAdmin = authUser.workAs === 'admin';
    
            // only allow the job poster or an admin to update the job
            if (!isJobPoster && !isAdmin) {
                return res.status(403).json({
                    success: false,
                    message: 'Only the job poster or an admin can update this job'
                });
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

    static async searchJob(req, res){
        try {
            const { city , niche, srcKeyword, page=1, limit=2} = req.query

            // define a object to store to query
            const query = {}

            //handleing  query to search the result
            if(city){
                query.location = city
            }
            if(niche){
                query.jobNiche = niche
            }
            if(srcKeyword){
                query.$or =[
                    {title: {$regex: srcKeyword, $options: 'i'}},
                    {companyName: {$regex: srcKeyword, $options: 'i'}},
                    {introduction: {$regex: srcKeyword, $options: 'i'}}
                ]

            }
            // appling condition to get positive number
            if( page < 0 ){
                page = 1
            }
            if( limit < 0 ){
                limit = 1
            }
            // define a number of job to skip
            const skip = (page -1)*limit

            //find the job using the query
            const findJob = await Job.find(query)
            .limit(parseInt(page))
            .skip(parseInt(skip))

            if(findJob.length === 0 ){
                return res.status(400).json({
                    success: false,
                    message: ' job is not found'
                })
            }
            // find the total no of jobs and page are available
            const totalJobs = await Job.countDocuments(query)
            const totalPage = Math.ceil(totalJobs/limit)

            // define a object to return
            const jobDetails = {
                jobs: totalJobs,
                Pages: totalPage,
                currentPage: page,
                job:findJob
            }

            return res.status(200).json({
                success: true,
                message: ' job is retrieved',
                job: jobDetails
            })

        } catch ( err ) {
            console.log(err)
            return res.status(404).json({
                success: false,
                message: err.message
            })
        }
    }

    static async myJob( req, res ){

        try {
            // retrieve the authenticated user
            const authUser =  req.user 

            // find the posted job
            const findJob = await Job.find({ postedBy: authUser.id })

            if(findJob.length === 0){
                return res.status(404).json({
                    success: false,
                    message: 'no job found'
                })
            }

            return res.status(200).json({
                success: true,
                message: ' job is retrieved',
                jobs: findJob
            })

        } catch (err) {
            console.log(err)
            return res.status(404).json({
                success: false,
                message: err.message
            })
        }


    }

}

export default JobAapplication