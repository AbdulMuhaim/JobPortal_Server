const express = require("express")
const adminController = require('../controllers/adminController')
const { verifyAdminToken } = require("../middlewares/authVerify")
const adminRouter = express.Router()




           // ADMIN ROUTES //
 adminRouter.post('/login',adminController.login)
 adminRouter.post('/addCategory',verifyAdminToken,adminController.addCategory)
 adminRouter.get('/fetchCategories',verifyAdminToken,adminController.fetchCategories)
 adminRouter.post('/editCategory',verifyAdminToken,adminController.editCategory)
 adminRouter.get('/fetchUsers',verifyAdminToken,adminController.fetchUsers)
 adminRouter.post('/userStatus',verifyAdminToken,adminController.userStatus)
 adminRouter.get('/fetchEmployers',verifyAdminToken,adminController.fetchEmployers)
 adminRouter.post('/employerStatus',verifyAdminToken,adminController.employerStatus)
 adminRouter.get('/fetchJobs',verifyAdminToken,adminController.fetchJobs)
 adminRouter.post('/jobStatus',verifyAdminToken,adminController.jobStatus)
 adminRouter.get('/fetchCardDatas',verifyAdminToken,adminController.fetchCardDatas)
 adminRouter.get('/fetchAmounts',verifyAdminToken,adminController.fetchAmounts)
 adminRouter.get('/fetchPlanCounts',verifyAdminToken,adminController.fetchPlanCounts)










module.exports = adminRouter
