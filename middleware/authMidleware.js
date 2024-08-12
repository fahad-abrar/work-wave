import jwt from 'jsonwebtoken'
import { User } from '../model/userSchema.js'

const authValidator =async(req,res, next)=>{
    const {email} = req.body
}