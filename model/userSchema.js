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

    resume:{
        public_id: String,
        url: String
    },
    image:{
        type: String
    }

})

const User = mongoose.model('User', userSchema)

export default User