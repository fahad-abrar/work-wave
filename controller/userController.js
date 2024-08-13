import { catchAsyncError } from '../middleware/catchAsyncError.js'
import errorHandler from '../middleware/errorHandler.js'
import User from '../model/userSchema.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import multerUploader from '../utils/fileHandler.js'
import fs from 'fs'

class authUser{

    static async getUser(req, res){
        try {
            return res.status(200).json({
                success: true,
                message:' user get successfully'
            })
            
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                success: false
            })
            
        }

    }
    static async getUserbyId(req, res){
        try {
            return res.status(200).json({
                success: true,
                message:' user get successfully'
            })
            
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                success: false
            })
            
        }

    }
    static async registerUser(req, res){
            try {
                const { name, email, password, phone, address,firstNiche, secondNiche, thirdNiche, coverLetter, workAs } = req.body;

                //check all the field are provided or not
                if (!name || !email || !password || !phone || !address || !workAs) {
                    return res.status(400).json({
                        success: false,
                        message: 'all the field are required ....',
                    });
                }

                if (workAs === 'jobSeeker') {
                    if(!firstNiche){
                    return res.status(400).json({
                        success: false,
                        message: 'first niche is required'
                        })
                    }
                }
                
                // Check if the user already exists
                const existUser = await User.findOne({ email });
                if (existUser) {
                    return res.status(200).json({
                        success: false,
                        message: 'Email is already used',
                    });
                }
        
                // Prepare the user data
                const userData = { 
                    name, 
                    email, 
                    password,
                    phone,
                    address,
                    niche:{
                        firstNiche, 
                        secondNiche, 
                        thirdNiche, 
                    },
                    coverLetter, 
                    workAs
                 };

                // Create the new user
                const newUser = await User.create(userData);

                // Check if an image is provided

                if (req.files && req.files.image) {
                    newUser.image.public_id = req.files.image[0].filename
                    newUser.image.url = req.files.image[0].path
                    await newUser.save()
                }
                // check if resume is provided
                if (req.files && req.files.resume) {
                    newUser.resume.public_id = req.files.resume[0].filename
                    newUser.resume.url = req.files.resume[0].path
                    await newUser.save()
                }

                console.log(newUser)
                return res.status(200).json({
                    success: true,
                    message: 'User registered successfully',
                    newUser,
                })
            } catch (error) {
                console.log(error)
                return res.status(400).json({
                    success: false,
                    message: 'An error occurred during registration',
                });
            }
        
        

    }
    static async logInUser(req, res){
        try {
            return res.status(200).json({
                success: true,
                message:' user get successfully'
            })
            
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                success: false
            })
            
        }

    }
    static async logOutUser(req, res){
        try {
            return res.status(200).json({
                success: true,
                message:' user get successfully'
            })
            
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                success: false
            })
            
        }

    }
    static async updateUser(req, res){
        try {
            return res.status(200).json({
                success: true,
                message:' user get successfully'
            })
            
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                success: false
            })
            
        }

    }
    static async deleteUser(req, res){
        try {
            return res.status(200).json({
                success: true,
                message:' user get successfully'
            })
            
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                success: false
            })
            
        }

    }


}



export default authUser