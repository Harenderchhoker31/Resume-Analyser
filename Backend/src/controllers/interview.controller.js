const pdfParse = require("pdf-parse")
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")

async function generateInterViewReportController(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Resume file is required" })
        }

        const { selfDescription, jobDescription } = req.body

        if (!jobDescription) {
            return res.status(400).json({ message: "Job description is required" })
        }

        const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()

        const interViewReportByAi = await generateInterviewReport({
            resume: resumeContent.text,
            selfDescription,
            jobDescription
        })

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeContent.text,
            selfDescription,
            jobDescription,
            matchScore: interViewReportByAi.matchScore,
            title: interViewReportByAi.title,
            technicalQuestions: interViewReportByAi.technicalQuestions,
            behavioralQuestions: interViewReportByAi.behavioralQuestions,
            skillGaps: interViewReportByAi.skillGaps,
            preparationPlan: interViewReportByAi.preparationPlan
        })

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        })
    } catch (err) {
        console.error("generateInterViewReportController error:", err)
        res.status(500).json({ message: err.message || "Failed to generate interview report" })
    }
}

async function getInterviewReportByIdController(req, res) {
    const { interviewId } = req.params
    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })
    if (!interviewReport) {
        return res.status(404).json({ message: "Interview report not found." })
    }
    res.status(200).json({ message: "Interview report fetched successfully.", interviewReport })
}

async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")
    res.status(200).json({ message: "Interview reports fetched successfully.", interviewReports })
}

async function generateResumePdfController(req, res) {
    try {
        const interviewReportId = req.params.interviewReportId.trim()
        const interviewReport = await interviewReportModel.findById(interviewReportId)
        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found." })
        }
        const { resume, jobDescription, selfDescription } = interviewReport
        if (!resume) {
            return res.status(400).json({ message: "No resume data found for this report." })
        }
        const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })
        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
        })
        res.send(pdfBuffer)
    } catch (err) {
        console.error("generateResumePdfController error:", err)
        res.status(500).json({ message: err.message || "Failed to generate resume PDF" })
    }
}

module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController }
