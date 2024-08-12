import { catchAsyncError } from '../middleware/catchAsyncError.js'
import errorHandler from '../middleware/errorHandler.js'
import User from '../model/userSchema.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import multerUploader from '../utils/fileHandler.js'

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
                const { name, email, password } = req.body;
        
                // Check if the user already exists
                const existUser = await User.findOne({ email });
                if (existUser) {
                    return res.status(200).json({
                        success: false,
                        message: 'Email is already used',
                    });
                }
        
                // Prepare the user data
                const userData = { name, email, password };
        
                // Check if an image is provided
                if (req.files && req.files.image) {
                    // Assuming you process the image upload and get the path or URL
                    userData.image = req.files.image; // Modify this line based on how you handle the image
                }
        
                // Create the new user
                const newUser = await User.create(userData); // Directly pass userData
                console.log(newUser)

                console.log("*******************")
        
                return res.status(200).json({
                    success: true,
                    message: 'User registered successfully',
                    newUser,
                });
            } catch (error) {
                console.log(error);
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
