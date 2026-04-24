const express = require('express')
const authmMiddleware=require("../middlewares/auth.middleware")
const interviewController = require('../controllers/interview.controller')
const upload=require("../middlewares/file.middleware")

const interviewRouter = express.Router()

interviewRouter.post('/',authmMiddleware.authUser,upload.single("resume"),interviewController.generateInterviewReportController)

interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController)



module.exports = interviewRouter 