import express from 'express'
import authUser from '../controller/userController.js'
import multerUploader from '../utils/fileHandler.js'
const router =express.Router()

// register router
router.get('/register', authUser.getUser )
router.post('/register',multerUploader, authUser.registerUser )



export default router