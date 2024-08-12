import express from 'express'
import authUser from '../controller/userController.js'
const router =express.Router()

// register router
router.get('/register', authUser.getUser )
router.post('/register', authUser.registerUser )



export default router