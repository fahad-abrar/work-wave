import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    jobType:{
        type: String,
        required: true,
        enum:['full-time', 'part-time']
    },
    location:{
        type: String,
        required: true
    },
    companyName:{
        type: String,
        required: true
    },
    introduction:{
        type: String,
        required: false 
    },
    responsibilities:{
        type: String,
        required: true
    },
    qualifications:{
        type: String,
        required: true
    },
    offers:{
        type: String,
        required: false
    },
    salary:{
        type: Number,
        required: true
    },
    hiringMultipleCandidates:{
        type: Boolean,
        default: true
    },
    personalWebsite:{
        title: String,
        url: String
    },
    jobNiche:{
        type: String,
        required: true
    },
    newsLetterSend:{
        type: Boolean,
        default: false
    },
    jobPostedOn:{
        type: Date,
        default: Date.now
    },
    postedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    }
})


const Job = mongoose.model('Job', jobSchema)
export default Job