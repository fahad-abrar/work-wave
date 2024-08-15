import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    phone:{
        type:Number,
    },
    address:{
        type:String
    },
    niche:{
        firstNiche:{
            type:String
        },
        secondNiche:{
            type:String
        },
        thirdNiche:{
            type:String
        }
    },
    coverLetter:{
        type: String
    },

    resume:{
        public_id: String,
        url: String
    },
    image:{
        public_id: String,
        url: String
    },
    workAs:{
        type:String,
        enum:[ 'admin', 'jobSeeker', 'employe']
    }

},{
    timestamps:true
})

const User = mongoose.model('User', userSchema)

export default User