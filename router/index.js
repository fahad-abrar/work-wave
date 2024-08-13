import express from 'express'
import authUser from '../controller/userController.js'
import multerUploader from '../utils/fileHandler.js'
const router =express.Router()

// register router
router.get('/register', authUser.getUser )
router.get('/register/:id', authUser.getUserbyId )
router.post('/register',multerUploader, authUser.registerUser )
router.post('/auth/login', authUser.logInUser )
router.get('/register/:id', authUser.logOutUser )
router.delete('/register/:id', authUser.deleteUser )
router.put('/register/:id', authUser.updateUser )



export default router