import express from 'express'
import authUser from '../controller/userController.js'
import multerUploader from '../utils/fileHandler.js'
const router =express.Router()
import authValidator from '../middleware/authMidleware.js'

//user register router
router.get('/auth/user', authValidator, authUser.getUser )
router.get('/auth/user/:id', authUser.getUserbyId )
router.post('/auth/register',multerUploader, authUser.registerUser )
router.post('/auth/login', authUser.logInUser )
router.get('/auth/logout', authUser.logOutUser )
router.put('/auth/update/:id', authUser.updateUser )
router.delete('/auth/delete/:id', authUser.deleteUser )
router.put('/auth/updatepassword', authUser.getUser )



export default router