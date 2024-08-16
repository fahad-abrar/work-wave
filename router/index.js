import express from 'express'
import authUser from '../controller/userController.js'
import multerUploader from '../utils/fileHandler.js'
const router =express.Router()
import authValidator from '../middleware/authMidleware.js'
import JobAapplication from '../controller/jobController.js'


//user register router
router.get('/auth/user', authValidator, authUser.getUser )
router.get('/auth/user/:id', authUser.getUserbyId )
router.post('/auth/register',multerUploader, authUser.registerUser )
router.post('/auth/login', authUser.logInUser )
router.get('/auth/logout', authUser.logOutUser )
router.put('/auth/update/:id', authUser.updateUser )
router.delete('/auth/delete/:id', authUser.deleteUser )
router.post('/auth/changepassword/:id', authUser.changePassword )
router.post('/auth/forgotpassword/:id', authUser.getUser )

// job application router
router.get('/job/getjob', authValidator , JobAapplication.getJob )
router.get('/job/search', authValidator , JobAapplication.searchJob )
router.get('/job/:id', JobAapplication.getJobById )
router.post('/job/postjob',authValidator, JobAapplication.postJob )
router.put('/job/:id',authValidator, JobAapplication.updateJob )
router.delete('/job/:id',authValidator, JobAapplication.deleteJob )

// job posting router

export default router