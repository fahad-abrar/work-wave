import express from 'express'
import authValidator from '../middleware/authMidleware.js'
import multerUploader from '../utils/fileHandler.js'
import authUser from '../controller/userController.js'
import JobAapplication from '../controller/jobController.js'
import ApplicationCntlr from '../controller/applicationController.js'


const router =express.Router()


//user register route
router.get('/auth/user', authValidator, authUser.getUser )
router.get('/auth/user/:id', authUser.getUserbyId )
router.post('/auth/register',multerUploader, authUser.registerUser )
router.post('/auth/login', authUser.logInUser )
router.get('/auth/logout', authUser.logOutUser )
router.put('/auth/update/:id', authUser.updateUser )
router.delete('/auth/delete/:id', authUser.deleteUser )
router.post('/auth/changepassword/:id', authUser.changePassword )
router.post('/auth/forgotpassword/:id', authUser.getUser )


// job posting route
router.get('/job/getjob', authValidator , JobAapplication.getJob )
router.get('/job/search', authValidator , JobAapplication.searchJob )
router.get('/job/myjob', authValidator , JobAapplication.myJob )
router.get('/job/:id',authValidator, JobAapplication.getJobById )
router.post('/job/postjob',authValidator, JobAapplication.postJob )
router.put('/job/:id',authValidator, JobAapplication.updateJob )
router.delete('/job/:id',authValidator, JobAapplication.deleteJob )


// job application route
router.post('/application/post/:id',multerUploader, authValidator, ApplicationCntlr.postApp )
router.put('/application/update/:id',multerUploader, authValidator, ApplicationCntlr.updateApp)
router.get('/application/poster', authValidator, ApplicationCntlr.getPosterApp )
router.get('/application/jobseeker', authValidator, ApplicationCntlr.getJobSeekerApp )
router.delete('/application/delete/:id', authValidator, ApplicationCntlr.deleteApp )

export default router