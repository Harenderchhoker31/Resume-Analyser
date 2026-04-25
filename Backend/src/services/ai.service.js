const OpenAI = require("openai")
const PDFDocument = require("pdfkit")

const ai = new OpenAI({
    apiKey: process.env.NVIDIA_API_KEY,
    baseURL: "https://integrate.api.nvidia.com/v1"
})

function generatePdfFromData(data) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50, size: 'A4' })
        const chunks = []
        doc.on('data', chunk => chunks.push(chunk))
        doc.on('end', () => resolve(Buffer.concat(chunks)))
        doc.on('error', reject)

        const primaryColor = '#1a2332'
        const mutedColor = '#555555'
        const tagBg = '#eef2f7'

        // Header
        doc.fontSize(22).fillColor(primaryColor).font('Helvetica-Bold')
            .text(data.name || 'Name', { align: 'center' })
        doc.fontSize(9).fillColor(mutedColor).font('Helvetica')
            .text([data.phone, data.email].filter(Boolean).join('  |  '), { align: 'center' })
        doc.moveDown(0.5)
        doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor(primaryColor).lineWidth(1.5).stroke()
        doc.moveDown(0.5)

        const sectionTitle = (title) => {
            doc.moveDown(0.3)
            doc.fontSize(9).fillColor(primaryColor).font('Helvetica-Bold')
                .text(title.toUpperCase(), { characterSpacing: 1.5 })
            doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor(primaryColor).lineWidth(1).stroke()
            doc.moveDown(0.4)
        }

        // Summary
        if (data.summary) {
            sectionTitle('Professional Summary')
            doc.fontSize(10).fillColor('#333').font('Helvetica').text(data.summary, { lineGap: 3 })
            doc.moveDown(0.3)
        }

        // Languages
        if (data.languages?.length) {
            sectionTitle('Programming Languages')
            doc.fontSize(10).fillColor('#333').font('Helvetica')
                .text(data.languages.join('  •  '))
            doc.moveDown(0.3)
        }

        // Skills
        if (data.skills?.length) {
            sectionTitle('Skills & Tools')
            doc.fontSize(10).fillColor('#333').font('Helvetica')
                .text(data.skills.join('  •  '))
            doc.moveDown(0.3)
        }

        // Projects
        if (data.projects?.length) {
            sectionTitle('Projects')
            data.projects.forEach(p => {
                doc.fontSize(10.5).fillColor(primaryColor).font('Helvetica-Bold').text(p.name, { continued: true })
                doc.fontSize(9).fillColor(mutedColor).font('Helvetica').text(`  —  ${p.tech}`)
                doc.fontSize(10).fillColor('#444').font('Helvetica').text(p.description, { lineGap: 2 })
                doc.moveDown(0.4)
            })
        }

        // Experience
        if (data.experience?.length) {
            sectionTitle('Experience')
            data.experience.forEach(e => {
                doc.fontSize(10.5).fillColor(primaryColor).font('Helvetica-Bold').text(e.role, { continued: true })
                doc.fontSize(9).fillColor(mutedColor).font('Helvetica').text(`  |  ${e.duration}`)
                doc.fontSize(10).fillColor('#555').font('Helvetica').text(e.company)
                doc.fontSize(10).fillColor('#444').font('Helvetica').text(e.description, { lineGap: 2 })
                doc.moveDown(0.4)
            })
        }

        // Education
        if (data.education?.length) {
            sectionTitle('Education')
            data.education.forEach(e => {
                doc.fontSize(10.5).fillColor(primaryColor).font('Helvetica-Bold').text(e.degree)
                doc.fontSize(10).fillColor('#555').font('Helvetica').text(`${e.institution}  |  ${e.year}  |  ${e.grade}`)
                doc.moveDown(0.4)
            })
        }

        // Activities
        if (data.activities?.length) {
            sectionTitle('Co-Curricular Activities')
            data.activities.forEach(a => {
                doc.fontSize(10).fillColor('#444').font('Helvetica').text(`• ${a}`, { lineGap: 2 })
            })
        }

        doc.end()
    })
}



async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `You are an expert technical interviewer and career coach. Analyze the candidate's resume, self description, and job description thoroughly, then generate a detailed interview report. Return ONLY a valid JSON object with no extra text.

Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}

Requirements:
- Generate at least 7 technical questions highly relevant to the job and candidate's background
- Generate at least 7 behavioral questions based on the candidate's experience and job requirements
- Identify ALL skill gaps between the candidate's profile and job requirements
- Create a 7-day detailed preparation plan with 4-5 specific tasks per day
- Each question answer must be concise (2-3 sentences) covering the key points and approach
- matchScore should reflect honest assessment of candidate fit. 

Return JSON in this exact format:
{
  "matchScore": <number 0-100>,
  "title": "<job title>",
  "technicalQuestions": [
    {"question": "<detailed question>", "intention": "<why interviewer asks this>", "answer": "<detailed answer with key points and approach>"}
  ],
  "behavioralQuestions": [
    {"question": "<detailed question>", "intention": "<why interviewer asks this>", "answer": "<detailed answer with STAR method guidance>"}
  ],
  "skillGaps": [
    {"skill": "<missing skill>", "severity": "low|medium|high"}
  ],
  "preparationPlan": [
    {"day": 1, "focus": "<topic>", "tasks": ["<specific task 1>", "<specific task 2>", "<specific task 3>", "<specific task 4>"]}
  ]
}`

    const response = await ai.chat.completions.create({
        model: "meta/llama-3.3-70b-instruct",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 4096
    })

    const text = response.choices[0].message.content
    const json = text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1)
    return JSON.parse(json)
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    const candidateInfo = resume || selfDescription || ""
    if (!candidateInfo) throw new Error("No resume or self description available to generate PDF")

    const prompt = `Extract information from the candidate profile below and return ONLY a valid JSON object with no extra text and no newlines inside string values.

Candidate Profile: ${candidateInfo}
Job Description: ${jobDescription}

Return this exact JSON (single-line strings only, no line breaks):
{
  "name": "full name",
  "phone": "phone",
  "email": "email",
  "summary": "3-4 sentence professional summary tailored to the job, highlighting strengths and relevant skills",
  "languages": ["language1", "language2"],
  "skills": ["skill1", "skill2"],
  "projects": [{"name": "name", "tech": "tech stack", "description": "2-3 line description of what it does and key features"}],
  "experience": [{"role": "role", "company": "company", "duration": "duration", "description": "what you did"}],
  "education": [{"degree": "degree", "institution": "institution", "year": "year range", "grade": "grade"}],
  "activities": ["detailed activity description"]
}`

    const response = await ai.chat.completions.create({
        model: "meta/llama-3.3-70b-instruct",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2048
    })

    const text = response.choices[0].message.content
    const json = text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1)
    const data = JSON.parse(json)

    return await generatePdfFromData(data)
}

module.exports = { generateInterviewReport, generateResumePdf }