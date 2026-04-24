const pdfParse=require("pdf-parse")
const generateInterviewReport=require("../services/ai.service")
const interviewReportModel=require("../models/interviewReport.model")

async function generateInterviewReportController(req,res){
   
    const resumeContent=await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer)) ).getText()
    const {selfDescription,jobDescription}=req.body

    const interviewReportByAi=await generateInterviewReport({ resume:
    resumeContent.text, selfDescription, jobDescription })

    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeContent.text,
        selfDescription,
        jobDescription,
        matchScore: interviewReportByAi.matchScore,
        technicalQuestion: interviewReportByAi.technicalQuestions,
        behavioralQuestion: interviewReportByAi.behavioralQuestions,
        skillGap: interviewReportByAi.skillGaps,
        preprationPlan: interviewReportByAi.preparationPlan
    })

    res.status(200).json({
        message:"Interview report generated successfully",
        interviewReport
    })

}
module.exports = {
    generateInterviewReportController
}
