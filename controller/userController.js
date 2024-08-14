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
            // find all user data
            const userData = await User.find()

            if(!userData){
                return res.status(400).json({
                    success: true,
                    message:' user data is not found'
                })
            }

            return res.status(200).json({
                success: true,
                message:' user get successfully',
                userData
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
            const { id } = req.params

            //find the user by id
            const findUser = await User.findById(id)
            if(!findUser){
                return res.status(400).json({
                    success: false,
                    message:' user is not found by this id'
                }) 
            }

            return res.status(200).json({
                success: true,
                message:' user retrieved successfully',
                findUser
            })
            
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                success: false,
                message:' an err is occured while retrieved the user'
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
                    return res.status(400).json({
                        success: false,
                        message: 'Email is already used',
                    });
                }
                // generating hash password
                const salt = bcrypt.genSaltSync(10)
                const hashPass = bcrypt.hashSync(password, salt)
        
                // Prepare the user data
                const userData = { 
                    name, 
                    email, 
                    password: hashPass,
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
            const {email, password} = req.body

            // find the user if the user is exist
            const findUser = await User.findOne({email})
            if(!findUser){
                return res.status(400).json({
                    success: false,
                    message: 'invalid email or password'
                    })
                }
            
            
            // Check that the password in the database is a string
            if (typeof findUser.password !== 'string') {
                console.log('Stored password is not a string:', findUser.password);
                return res.status(400).json({
                    success: false,
                    message: 'Invalid email or password',
                });
            }

            // check given password is correct or not
            const isMatch = bcrypt.compareSync(password, findUser.password);

            // const isMatch = bcrypt.compareSync(password, findUser.password)
            if(!isMatch){
                return res.status(400).json({
                    success: false,
                    message: 'invalid email or password'
                    })
                }
            
            // generate a payload to store user data in token
            const payload = {
                id: findUser._id,
                userName: findUser.name,
                email: findUser.email
            }

            //generate a token
            const token = jwt.sign(payload, process.env.JWT_SECRET,{
                expiresIn:"365d"
            })

            console.log(token)
            const option={ 
                expires : new Date(Date.now() + 24*60*60*1000),
                httpOnly: true
            }

            return res.cookie('token', token, option).status(200).json({
                success: true,
                message:' user get successfully',
                token
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
            const {id } = req.params
            const updateData = req.body

            // update the user data
            const findUser = await User.findByIdAndUpdate(id, updateData, {
                new:true
            })

            if (!findUser) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
            
            // Check if an image is provided
            if (req.files && req.files.image) {
                findUser.image.public_id = req.files.image[0].filename
                findUser.image.url = req.files.image[0].path            
            }

            // check if resume is provided
            if (req.files && req.files.resume) {
                findUser.resume.public_id = req.files.resume[0].filename
                findUser.resume.url = req.files.resume[0].path
            
            }

            // save the image and resume in user data
            await findUser.save()
            console.log(findUser)

            return res.status(200).json({
                success: true,
                message:' user updated successfully',
                findUser
            })
            
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                success: false,
                massage: error.massage
            })
            
        }

    }

    static async deleteUser(req, res){
        try {
            const {id } = req.params
            
            // delete the user finding by the id
            const findUser = await User.findByIdAndDelete(id)
            
            if (!findUser) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            return res.status(200).json({
                success: true,
                message:' user deleted successfully',
                findUser
            })
            
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                success: false,
                message: error.message
            })
            
        }

    }


}



export default authUser