import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    jobSeekerInfo:{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref : 'User',
            require: true
        },
        name:{
            type: String,
            require: true
        },
        email:{
            type: String,
            require: true
        },
        phone:{
            type: String,
            require: true
        },
        address:{
            type: String,
            require: true
        },
        resume:{
            public_id: String,
            url: String
        },
        coverLetter:{
            type: String,
            required:false
        },
        role:{
            type: String,
            enum:['jobSeeker'],
            require: true
        }
    },
    employerInfo:{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'User',
            required: true
        },
        role:{
            type:String,
            enum:['employe'],
            required:true
        }

    },
    jobInfo:{
        jobId:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'Job',
            required: true
        },
        jobTitle:{
            type:String,
            required:true
        }

    },
    deletedBy:{
        jobSeeker:{
            type: Boolean,
            default: false
        },
        employe:{
            type: Boolean,
            default: false
        }
    }
})

export const Application = mongoose.model('Application', applicationSchema)