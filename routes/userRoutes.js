const express = require("express")
const userController = require('../controllers/userController')
const chatController = require('../controllers/chatController')
const userRouter = express.Router()
const {verifyUserToken} = require("../middlewares/authVerify")

           // COMMON ROUTES //
userRouter.post('/register',userController.register)


           // USER ROUTES //
userRouter.post('/login',userController.login)
userRouter.post('/forgotPassword',userController.forgotPassword)
userRouter.post('/setNewPassword',userController.setNewPassword)
userRouter.post('/googleLogin',userController.googleLogin)
userRouter.post('/newOTP',userController.newOTP)
userRouter.post('/profileData',verifyUserToken,userController.profileData)
userRouter.get('/fetchProfileData',verifyUserToken,userController.fetchProfileData)
userRouter.post('/removeProfileData',verifyUserToken,userController.removeProfileData)
userRouter.post('/fetchJobs',userController.fetchJobs)
userRouter.get ('/fetchCategories',userController.fetchCategories)
userRouter.post ('/fetchJobDetails',verifyUserToken,userController.fetchJobDetails)
userRouter.post('/homeSearch',userController.homeSearch)
userRouter.post('/jobApplication',verifyUserToken,userController.jobApplication)
userRouter.get('/fetchNotification',verifyUserToken,userController.fetchNotification) 


// CHAT
userRouter.route('/chat')
    .post (verifyUserToken,chatController.accessChat)
    .get(verifyUserToken,chatController.fetchChats)
userRouter.get('/openChat',verifyUserToken,chatController.allMessages)
userRouter.post('/storeMessage',verifyUserToken,chatController.sendMessage)









module.exports = userRouter
