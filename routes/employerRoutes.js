const express = require("express");
const employerController = require('../controllers/employerController');
const employerRouter = express.Router();
const {verifyEmployerToken} = require("../middlewares/authVerify")
const chatController = require('../controllers/chatController')



// EMPLOYER ROUTES
employerRouter.post('/login',employerController.login);
employerRouter.post('/addJob',verifyEmployerToken,employerController.addJob);
employerRouter.get('/fetchJobs',verifyEmployerToken,employerController.fetchJobs)
employerRouter.post('/jobIsBlocked',verifyEmployerToken,employerController.jobIsBlocked)
employerRouter.get('/fetchApplications',verifyEmployerToken,employerController.fetchApplications)
employerRouter.post('/employeeInfo',verifyEmployerToken,employerController.employeeInfo)
employerRouter.get('/payment',verifyEmployerToken,employerController.payment)
employerRouter.get('/paymentSuccess',employerController.paymentSuccess)
employerRouter.get('/paymentFail',employerController.paymentFail)
employerRouter.get('/fetchEmployerPlan',verifyEmployerToken,employerController.fetchEmployerPlan)
employerRouter.post('/applicationStatus',verifyEmployerToken,employerController.applicationStatus)





// CHAT
employerRouter.route('/chat')
    .post (verifyEmployerToken,chatController.accessChat)
    .get(verifyEmployerToken,chatController.fetchChats)
employerRouter.get('/openChat',verifyEmployerToken,chatController.allMessages)
employerRouter.post('/storeMessage',verifyEmployerToken,chatController.sendMessage)




module.exports = employerRouter;
